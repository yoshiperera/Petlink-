import {
  useLayoutEffect,
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type DragEvent,
  type FormEvent,
  type ReactNode,
} from "react";
import { UploadCloud } from "lucide-react";
import { supabase, PHOTO_BUCKET, VIDEO_BUCKET, type PetReport } from "@/lib/supabase";
import { notifyPotentialMatches } from "@/lib/matching";
import { useAuth } from "@/hooks/use-auth";

interface Props {
  kind: "lost" | "found";
}

const inputCls =
  "h-11 w-full rounded-md border border-input bg-background px-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20";

const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
const MAX_IMAGE_SIZE_BYTES = 5 * 1024 * 1024;
const ALLOWED_VIDEO_TYPES = ["video/mp4", "video/webm", "video/quicktime", "video/x-matroska"];
const MAX_VIDEO_SIZE_BYTES = 45 * 1024 * 1024;

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-semibold text-foreground">{label}</span>
      {children}
    </label>
  );
}

/**
 * Generates a client-side id. Used both for storage upload paths and, for
 * found reports, as the pet_reports row id itself - since that insert can't
 * use .select() to read the id back afterwards (see handleSubmit below).
 */
function generateId() {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

/**
 * Grabs a single still from the uploaded video.
 *
 * The AI matcher compares images, not video, so a found report needs a frame to
 * put beside the lost report's photo. Doing it here in the browser means the
 * server never has to decode video.
 */
async function extractVideoFrame(file: File): Promise<File | null> {
  const objectUrl = URL.createObjectURL(file);
  const video = document.createElement("video");
  video.muted = true;
  video.playsInline = true;
  video.preload = "metadata";
  video.src = objectUrl;

  try {
    await new Promise<void>((resolve, reject) => {
      video.onloadedmetadata = () => {
        // Frame zero is often black while the camera settles, so seek in a bit.
        video.currentTime = Math.min(1, (video.duration || 1) / 2);
      };
      video.onseeked = () => resolve();
      video.onerror = () => reject(new Error("Could not read the video"));
      setTimeout(() => reject(new Error("Timed out reading the video")), 10_000);
    });

    if (!video.videoWidth || !video.videoHeight) return null;

    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const context = canvas.getContext("2d");
    if (!context) return null;
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    const blob = await new Promise<Blob | null>((resolve) => {
      canvas.toBlob((result) => resolve(result), "image/jpeg", 0.9);
    });
    if (!blob) return null;

    return new File([blob], `frame-${Date.now()}.jpg`, { type: "image/jpeg" });
  } catch {
    // A missing frame only weakens AI matching; the report itself still stands.
    return null;
  } finally {
    URL.revokeObjectURL(objectUrl);
  }
}

async function uploadToBucket(bucket: string, file: File): Promise<string | null> {
  const extension = file.name.split(".").pop() ?? "bin";
  const path = `${generateId()}.${extension}`;

  const { error } = await supabase.storage.from(bucket).upload(path, file, {
    contentType: file.type,
    upsert: false,
  });
  if (error) throw error;

  // pet-videos is a private bucket, so there is no public URL to hand out - the
  // stored path is resolved to a signed URL only when a match email is sent.
  if (bucket === VIDEO_BUCKET) return path;

  return supabase.storage.from(bucket).getPublicUrl(path).data.publicUrl;
}

export function ReportPetForm({ kind }: Props) {
  const { user } = useAuth();
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [petName, setPetName] = useState("");
  const [breed, setBreed] = useState("");
  const [color, setColor] = useState("");
  const [lastSeenLocation, setLastSeenLocation] = useState("");
  const [description, setDescription] = useState("");
  const [contactInfo, setContactInfo] = useState("");
  const [foundStatus, setFoundStatus] = useState("");
  const [petPhoto, setPetPhoto] = useState<File | null>(null);
  const [photoPreviewUrl, setPhotoPreviewUrl] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isDraggingPhoto, setIsDraggingPhoto] = useState(false);
  const [petVideo, setPetVideo] = useState<File | null>(null);
  const [videoPreviewUrl, setVideoPreviewUrl] = useState<string | null>(null);
  const [isDraggingVideo, setIsDraggingVideo] = useState(false);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [isStartingCamera, setIsStartingCamera] = useState(false);
  const photoInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);
  const cameraVideoRef = useRef<HTMLVideoElement>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const pendingCameraStreamRef = useRef<MediaStream | null>(null);

  const isFoundReport = kind === "found";

  useEffect(() => {
    if (!petPhoto) {
      setPhotoPreviewUrl(null);
      return;
    }

    const previewUrl = URL.createObjectURL(petPhoto);
    setPhotoPreviewUrl(previewUrl);

    return () => {
      URL.revokeObjectURL(previewUrl);
    };
  }, [petPhoto]);

  useEffect(() => {
    if (!petVideo) {
      setVideoPreviewUrl(null);
      return;
    }

    const previewUrl = URL.createObjectURL(petVideo);
    setVideoPreviewUrl(previewUrl);

    return () => {
      URL.revokeObjectURL(previewUrl);
    };
  }, [petVideo]);

  useEffect(() => {
    return () => {
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach((track) => track.stop());
        mediaStreamRef.current = null;
      }
      if (pendingCameraStreamRef.current) {
        pendingCameraStreamRef.current.getTracks().forEach((track) => track.stop());
        pendingCameraStreamRef.current = null;
      }
    };
  }, []);

  useLayoutEffect(() => {
    if (!isCameraOpen) {
      return;
    }

    const video = cameraVideoRef.current;
    const stream = pendingCameraStreamRef.current;

    if (!video || !stream) {
      return;
    }

    mediaStreamRef.current = stream;
    pendingCameraStreamRef.current = null;
    video.srcObject = stream;
    void video.play();
  }, [isCameraOpen]);

  const title = kind === "lost" ? "Report a Lost Pet" : "Report a Found Pet";
  const subtitle =
    kind === "lost"
      ? "Share details about your missing pet so our community can help bring them home."
      : "Help us reunite a found pet with their family. Share what you know.";

  const getPhotoValidationError = (file: File) => {
    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      return "Only JPG, JPEG, PNG, and WEBP images are allowed.";
    }

    if (file.size > MAX_IMAGE_SIZE_BYTES) {
      return "Image size must be 5MB or smaller.";
    }

    return null;
  };

  const getVideoValidationError = (file: File) => {
    if (!ALLOWED_VIDEO_TYPES.includes(file.type)) {
      return "Only MP4, WEBM, MOV, and MKV videos are allowed.";
    }

    if (file.size > MAX_VIDEO_SIZE_BYTES) {
      return "Video size must be 45MB or smaller.";
    }

    return null;
  };

  const handlePhotoSelect = (file: File | null) => {
    if (!file) {
      return;
    }

    const validationError = getPhotoValidationError(file);
    if (validationError) {
      setUploadError(validationError);
      setPetPhoto(null);
      return;
    }

    setUploadError(null);
    setPetPhoto(file);
  };

  const handleVideoSelect = (file: File | null) => {
    if (!file) {
      return;
    }

    const validationError = getVideoValidationError(file);
    if (validationError) {
      setUploadError(validationError);
      setPetVideo(null);
      return;
    }

    setUploadError(null);
    setPetVideo(file);
  };

    const handlePhotoInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0] ?? null;
    handlePhotoSelect(selectedFile);
  };

  const handleVideoInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0] ?? null;
    handleVideoSelect(selectedFile);
    event.target.value = "";
  };

  const handlePhotoDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDraggingPhoto(false);
    const droppedFile = event.dataTransfer.files?.[0] ?? null;
    handlePhotoSelect(droppedFile);
  };

  const handleVideoDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDraggingVideo(false);
    const droppedFile = event.dataTransfer.files?.[0] ?? null;
    handleVideoSelect(droppedFile);
  };

  const openCamera = async () => {
    if (!navigator.mediaDevices?.getUserMedia) {
      setUploadError("Camera is not supported on this device/browser.");
      return;
    }

    setIsStartingCamera(true);
    setUploadError(null);

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
        audio: false,
      });

      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      }

      setIsCameraOpen(true);
      pendingCameraStreamRef.current = stream;
    } catch {
      setUploadError(
        "Unable to access camera. Please allow camera permission or upload from files.",
      );
      setIsCameraOpen(false);
    } finally {
      setIsStartingCamera(false);
    }
  };

  const closeCamera = () => {
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      mediaStreamRef.current = null;
    }
    if (pendingCameraStreamRef.current) {
      pendingCameraStreamRef.current.getTracks().forEach((track) => track.stop());
      pendingCameraStreamRef.current = null;
    }
    if (cameraVideoRef.current) {
      cameraVideoRef.current.srcObject = null;
    }
    setIsCameraOpen(false);
  };

  const capturePhoto = async () => {
    const video = cameraVideoRef.current;
    if (!video || video.videoWidth === 0 || video.videoHeight === 0) {
      setUploadError("Camera is not ready yet. Please try again in a moment.");
      return;
    }

    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const context = canvas.getContext("2d");
    if (!context) {
      setUploadError("Could not capture photo. Please upload from files.");
      return;
    }

    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    const blob = await new Promise<Blob | null>((resolve) => {
      canvas.toBlob((capturedBlob) => resolve(capturedBlob), "image/jpeg", 0.92);
    });

    if (!blob) {
      setUploadError("Could not capture photo. Please upload from files.");
      return;
    }

    const capturedFile = new File([blob], `captured-pet-${Date.now()}.jpg`, { type: "image/jpeg" });
    handlePhotoSelect(capturedFile);
    closeCamera();
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitError(null);

    if (isFoundReport && !petVideo) {
      setUploadError("Please upload a video of the pet you found.");
      return;
    }

    if (!isFoundReport && !petPhoto) {
      setUploadError("Please upload a photo of your pet. It is what we match against.");
      return;
    }

    if (!isFoundReport && !user) {
      setSubmitError("Please sign in before reporting a lost pet.");
      return;
    }

    setSubmitting(true);

    try {
      let photoUrl: string | null = null;
      let videoPath: string | null = null;

      if (isFoundReport && petVideo) {
        videoPath = await uploadToBucket(VIDEO_BUCKET, petVideo);
        const frame = await extractVideoFrame(petVideo);
        if (frame) {
          photoUrl = await uploadToBucket(PHOTO_BUCKET, frame);
        }
      }

      if (!isFoundReport && petPhoto) {
        photoUrl = await uploadToBucket(PHOTO_BUCKET, petPhoto);
      }
      let data: PetReport | null = null;

      if (isFoundReport) {
        // Found reports have no SELECT policy (private by design), so the
        // inserted row can't be read back with .select(). Generating the id
        // client-side means we still have it afterwards, for the ML match call.
        const foundReportId = generateId();
        const { error } = await supabase.from("pet_reports").insert({
          id: foundReportId,
          type: kind,
          pet_owner_id: null,
          pet_name: null,
          pet_type: null,
          breed: breed,
          color: color,
          location: lastSeenLocation,
          description: description,
          contact_info: contactInfo,
          status: foundStatus,
          photo_url: photoUrl,
          video_url: videoPath,
        });

        if (error) throw error;
        data = { id: foundReportId, type: "found" } as PetReport;
      } else {
        const { data: inserted, error } = await supabase
          .from("pet_reports")
          .insert({
            type: kind,
            pet_owner_id: user?.id ?? null,
            pet_name: petName,
            pet_type: null,
            breed: null,
            color: null,
            location: lastSeenLocation,
            description: null,
            contact_info: null,
            status: null,
            photo_url: photoUrl,
            video_url: videoPath,
          })
          .select()
          .single();

        if (error) throw error;
        data = inserted as PetReport;
      }

      // Runs for both kinds: a match can surface from either direction, and a
      // found report often lands days before the owner gets around to reporting.
      if (data) {
        await notifyPotentialMatches(data);
      }

      setSubmitted(true);
    } catch (error) {
      setSubmitError(
        error instanceof Error
          ? error.message
          : "Something went wrong submitting your report. Please try again.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="mx-auto max-w-xl px-4 py-20 text-center">
        <h2 className="text-3xl text-foreground">Thank you! 🐾</h2>
        <p className="mt-3 text-muted-foreground">
          {isFoundReport
            ? "Your report has been received. If it matches a missing pet, we'll email the owner right away with your contact details."
            : "Your report has been received. We'll email you the moment a matching found pet is reported."}
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6">
      <h1 className="text-4xl text-foreground">{title}</h1>
      <p className="mt-2 text-muted-foreground">{subtitle}</p>
      <form
        onSubmit={handleSubmit}
        className="mt-8 space-y-5 rounded-2xl border border-border bg-card p-7 shadow-sm"
      >
        {isFoundReport ? (
          <>
            <Field label="Pet Video">
              <input
                ref={videoInputRef}
                type="file"
                accept="video/mp4,video/webm,video/quicktime,video/x-matroska"
                className="hidden"
                onChange={handleVideoInputChange}
              />
              <div
                onDragOver={(event) => {
                  event.preventDefault();
                  setIsDraggingVideo(true);
                }}
                onDragLeave={() => setIsDraggingVideo(false)}
                onDrop={handleVideoDrop}
                onClick={() => videoInputRef.current?.click()}
                className={`relative flex min-h-56 w-full cursor-pointer flex-col items-center justify-center rounded-md border-2 border-dashed px-4 py-8 text-center transition-colors ${
                  isDraggingVideo
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/60"
                }`}
                role="button"
                tabIndex={0}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    videoInputRef.current?.click();
                  }
                }}
              >
                {videoPreviewUrl ? (
                  <video
                    src={videoPreviewUrl}
                    controls
                    playsInline
                    className="max-h-64 w-full rounded-md"
                    onClick={(event) => event.stopPropagation()}
                  />
                ) : (
                  <>
                    <UploadCloud className="h-10 w-10 text-muted-foreground" aria-hidden="true" />
                    <p className="mt-3 text-sm font-semibold text-foreground">
                      Click to upload or drag and drop
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      MP4, WEBM, MOV, MKV up to 45MB
                    </p>
                  </>
                )}
              </div>
              {uploadError ? <p className="mt-2 text-sm text-destructive">{uploadError}</p> : null}
              <p className="mt-2 text-xs text-muted-foreground">
                Your video stays private. It is only used to match against reported missing pets.
              </p>
            </Field>
            <Field label="Current status">
              <input
                className={inputCls}
                placeholder="e.g. With me at home, at the vet, still on the street..."
                value={foundStatus}
                onChange={(event) => setFoundStatus(event.target.value)}
              />
            </Field>
          </>
        ) : (
          <Field label="Pet Photo">
            <input
              ref={photoInputRef}
              type="file"
              accept="image/jpeg,image/jpg,image/png,image/webp"
              className="hidden"
              onChange={handlePhotoInputChange}
            />
            <div
              onDragOver={(event) => {
                event.preventDefault();
                setIsDraggingPhoto(true);
              }}
              onDragLeave={() => setIsDraggingPhoto(false)}
              onDrop={handlePhotoDrop}
              onClick={() => photoInputRef.current?.click()}
              className={`relative flex min-h-56 w-full cursor-pointer flex-col items-center justify-center rounded-md border-2 border-dashed px-4 py-8 text-center transition-colors ${
                isDraggingPhoto
                  ? "border-primary bg-primary/5"
                  : "border-border hover:border-primary/60"
              }`}
              role="button"
              tabIndex={0}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  photoInputRef.current?.click();
                }
              }}
            >
              {photoPreviewUrl ? (
                <img
                  src={photoPreviewUrl}
                  alt="Selected pet"
                  className="max-h-64 w-full rounded-md object-cover"
                />
              ) : (
                <>
                  <UploadCloud className="h-10 w-10 text-muted-foreground" aria-hidden="true" />
                  <p className="mt-3 text-sm font-semibold text-foreground">
                    Click to upload or drag and drop
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    JPG, JPEG, PNG, WEBP up to 5MB
                  </p>
                </>
              )}
            </div>
            {uploadError ? <p className="mt-2 text-sm text-destructive">{uploadError}</p> : null}
            <div className="mt-2 flex flex-wrap items-center gap-3">
              <button
                type="button"
                className="text-sm font-semibold text-primary hover:text-primary/80"
                onClick={() => photoInputRef.current?.click()}
              >
                Browse My Files
              </button>
              <button
                type="button"
                className="text-sm font-semibold text-primary hover:text-primary/80 disabled:cursor-not-allowed disabled:text-muted-foreground"
                onClick={openCamera}
                disabled={isStartingCamera || isCameraOpen}
              >
                {isStartingCamera ? "Opening Camera..." : "Open Camera"}
              </button>
              {isCameraOpen ? (
                <button
                  type="button"
                  className="text-sm font-semibold text-primary hover:text-primary/80"
                  onClick={closeCamera}
                >
                  Close Camera
                </button>
              ) : null}
            </div>
            {isCameraOpen ? (
              <div className="mt-3 rounded-md border border-border p-3">
                <video
                  ref={cameraVideoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full rounded-md"
                />
                <button
                  type="button"
                  className="mt-3 h-10 rounded-md bg-primary px-4 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
                  onClick={capturePhoto}
                >
                  Take Photo
                </button>
              </div>
            ) : null}
          </Field>
        )}
        {isFoundReport ? (
          <>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Breed">
                <input
                  className={inputCls}
                  placeholder="e.g. Labrador"
                  value={breed}
                  onChange={(event) => setBreed(event.target.value)}
                />
              </Field>
              <Field label="Color">
                <input
                  className={inputCls}
                  placeholder="e.g. White"
                  value={color}
                  onChange={(event) => setColor(event.target.value)}
                />
              </Field>
            </div>
            <Field label="Where you found the pet">
              <input
                required
                className={inputCls}
                placeholder="Street, city, landmark"
                value={lastSeenLocation}
                onChange={(event) => setLastSeenLocation(event.target.value)}
              />
            </Field>
            <Field label="Description">
              <textarea
                rows={4}
                className={inputCls + " resize-none py-2"}
                placeholder="Distinctive features, collar, behavior..."
                value={description}
                onChange={(event) => setDescription(event.target.value)}
              />
            </Field>
            <Field label="Contact info">
              <input
                required
                className={inputCls}
                placeholder="Phone or email"
                value={contactInfo}
                onChange={(event) => setContactInfo(event.target.value)}
              />
            </Field>
            <p className="-mt-3 text-xs text-muted-foreground">
              Shared only with the pet's owner if we find a match. Never shown publicly.
            </p>
          </>
        ) : (
          // A lost report only needs the photo - that is what the AI matches on.
          // Name and location are optional: the name is what appears on Happy
          // Tails, and the location keeps matches regional.
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Pet Name (optional)">
              <input
                className={inputCls}
                placeholder="e.g. Bruno"
                value={petName}
                onChange={(event) => setPetName(event.target.value)}
              />
            </Field>
            <Field label="Last seen location (optional)">
              <input
                className={inputCls}
                placeholder="Street, city, landmark"
                value={lastSeenLocation}
                onChange={(event) => setLastSeenLocation(event.target.value)}
              />
            </Field>
          </div>
        )}
        {submitError ? <p className="text-sm text-destructive">{submitError}</p> : null}
        <button
          disabled={submitting}
          className="h-11 w-full rounded-md bg-primary text-sm font-semibold text-primary-foreground hover:bg-primary/90 disabled:opacity-60"
        >
          {submitting ? "Submitting..." : "Submit Report"}
        </button>
      </form>
    </div>
  );
}