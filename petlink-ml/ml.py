"""
PetLink ML core.

This file holds everything the notebook worked out:
  - the DogEmbeddingNet architecture
  - loading the trained weights (dog_face_model.pth)
  - YOLO dog detection + cropping
  - turning a video into the best available dog crop
  - turning any image into a 128-number embedding
"""

import os
import tempfile
import cv2
import numpy as np
import torch
import torch.nn as nn
import torch.nn.functional as F
import torchvision.models as models
import torchvision.transforms as transforms
from PIL import Image
from ultralytics import YOLO

DEVICE = torch.device("cuda" if torch.cuda.is_available() else "cpu")

# Chosen from the threshold table in the notebook.
# 0.40 gives recall 97.13% (only 16 missed dogs) vs 0.60 which missed 50.
# A false positive is a dismissable email; a false negative loses the dog.
MATCH_THRESHOLD = 0.40


class DogEmbeddingNet(nn.Module):
    """Same architecture as the notebook. Must match, or the weights won't load."""

    def __init__(self, embedding_size=128):
        super().__init__()
        backbone = models.resnet18(weights=None)  # weights come from our .pth
        backbone.fc = nn.Linear(backbone.fc.in_features, embedding_size)
        self.backbone = backbone

    def forward(self, x):
        x = self.backbone(x)
        return F.normalize(x, p=2, dim=1)


# Same normalisation as test_transform in the notebook.
# No augmentation here - this is inference, not training.
# IMG_SIZE must match the notebook's training config (160) - the model
# never saw 224x224 inputs during training, so resizing to 224 here would
# silently degrade every embedding it produces.
IMG_SIZE = 160

TRANSFORM = transforms.Compose([
    transforms.Resize((IMG_SIZE, IMG_SIZE)),
    transforms.ToTensor(),
    transforms.Normalize(mean=[0.485, 0.456, 0.406],
                         std=[0.229, 0.224, 0.225]),
])

_model = None
_yolo = None


def load_models(weights_path="dog_face_model.pth"):
    """Called once when the server starts. Loading per-request would be far too slow."""
    global _model, _yolo

    _model = DogEmbeddingNet().to(DEVICE)
    _model.load_state_dict(torch.load(weights_path, map_location=DEVICE))
    _model.eval()

    _yolo = YOLO("yolov8n.pt")

    print(f"Models loaded on {DEVICE}")


def detect_and_crop_dog(image_array, min_confidence=0.6):
    """
    Find the dog in a frame and cut it out.

    Filters to the 'dog' class only - without this, YOLO also reports things
    like 'sports ball' for a dog's tongue. Keeps the highest-confidence dog
    if several are present.
    """
    results = _yolo(image_array, verbose=False)

    best_box = None
    best_conf = 0
    best_cat_conf = 0

    for box in results[0].boxes:
        cls_name = _yolo.names[int(box.cls)]
        conf = float(box.conf)
        if cls_name == "dog" and conf > best_conf and conf >= min_confidence:
            best_conf = conf
            best_box = box.xyxy[0].tolist()
        elif cls_name == "cat" and conf > best_cat_conf:
            best_cat_conf = conf

    # A frame where YOLO is more confident it's a cat than a dog is almost
    # always a cat wrongly also tagged "dog" at low confidence - treat it as
    # no detection rather than crop and embed an animal the model never
    # trained on.
    if best_box is None or best_cat_conf > best_conf:
        return None, 0.0

    x1, y1, x2, y2 = [int(v) for v in best_box]
    return image_array[y1:y2, x1:x2], best_conf


def best_crop_from_video(video_bytes, num_frames=15):
    """
    Sample frames evenly across the video, run YOLO on each, and return the
    crop YOLO was most confident about.

    That single crop becomes the found report's photo_url - the schema comment
    says the matcher always needs an image on both sides.
    """
    tmp_path = os.path.join(tempfile.gettempdir(), "_petlink_video.mp4")
    with open(tmp_path, "wb") as f:
        f.write(video_bytes)

    cap = cv2.VideoCapture(tmp_path)
    total = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
    if total == 0:
        cap.release()
        return None, 0.0

    step = max(total // num_frames, 1)
    best_crop, best_conf = None, 0.0

    for i in range(0, total, step):
        cap.set(cv2.CAP_PROP_POS_FRAMES, i)
        ok, frame = cap.read()
        if not ok:
            continue

        # OpenCV gives BGR; the model was trained on RGB. Skipping this
        # produces blue dogs and wrecks the matching.
        frame_rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        crop, conf = detect_and_crop_dog(frame_rgb)

        if crop is not None and conf > best_conf:
            best_crop, best_conf = crop, conf

    cap.release()
    return best_crop, best_conf


def get_embedding(image):
    """Any image (PIL or numpy) -> 128 numbers."""
    if isinstance(image, np.ndarray):
        image = Image.fromarray(image)
    image = image.convert("RGB")

    tensor = TRANSFORM(image).unsqueeze(0).to(DEVICE)
    with torch.no_grad():
        emb = _model(tensor)
    return emb.cpu().numpy()[0].tolist()


def cosine_similarity(emb_a, emb_b):
    """Both embeddings are already L2-normalised, so this is just a dot product."""
    a = np.array(emb_a)
    b = np.array(emb_b)
    return float(np.dot(a, b))


def send_match_email(to_email, pet_name, score, found_report):
    """
    Emails the owner when a found report scores above threshold.
    Sent via Gmail SMTP - Resend's sandbox mode only allows sending to the
    account owner's own address, which blocks notifying real report owners.
    """
    import smtplib
    from email.mime.text import MIMEText
    from email.mime.multipart import MIMEMultipart

    smtp_email = os.getenv("SMTP_EMAIL")
    smtp_password = os.getenv("SMTP_APP_PASSWORD")

    html = f"""
    <div style="font-family: sans-serif; max-width: 500px;">
      <h2 style="color: #2563eb;">A possible match for {pet_name or 'your pet'}</h2>

      <p>Someone reported finding a dog that looks like yours.</p>

      <img src="{found_report.get('photo_url', '')}"
           style="width:100%; border-radius:8px;">

      <table style="margin-top:16px; width:100%;">
        <tr><td><b>Breed</b></td><td>{found_report.get('breed') or 'Not specified'}</td></tr>
        <tr><td><b>Colour</b></td><td>{found_report.get('color') or 'Not specified'}</td></tr>
        <tr><td><b>Found at</b></td><td>{found_report.get('location') or 'Not specified'}</td></tr>
        <tr><td><b>Status</b></td><td>{found_report.get('status') or 'Not specified'}</td></tr>
        <tr><td><b>Match confidence</b></td><td>{score:.0%}</td></tr>
      </table>

      <div style="margin-top:16px; padding:12px; background:#eff6ff; border-radius:8px;">
        <b>Contact the finder:</b><br>
        {found_report.get('contact_info') or 'Not provided'}
      </div>

      <p style="color:#666; font-size:13px; margin-top:24px;">
        This is an automated match from PetLink. Please verify the photo
        before making contact. This match is not a guarantee.
      </p>
    </div>
    """

    msg = MIMEMultipart("alternative")
    msg["Subject"] = f"Possible match found for {pet_name or 'your pet'}"
    msg["From"] = smtp_email
    msg["To"] = to_email
    msg.attach(MIMEText(html, "html"))

    with smtplib.SMTP("smtp.gmail.com", 587) as server:
        server.starttls()
        server.login(smtp_email, smtp_password)
        server.sendmail(smtp_email, to_email, msg.as_string())