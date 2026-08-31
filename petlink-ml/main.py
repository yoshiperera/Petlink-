"""
PetLink ML API.

Run with:  uvicorn main:app --reload --port 8000

Endpoints
  GET  /health                     is the service up, are the models loaded
  POST /embed-lost/{report_id}     compute + store the embedding for a lost report,
                                    then check it against existing found reports
  POST /match-found/{report_id}    process a found report's video and find matches
                                    among existing lost reports
"""

import os
import io

import httpx
import numpy as np
from dotenv import load_dotenv
from fastapi import FastAPI, Header, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from PIL import Image
from supabase import create_client

import ml

load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_SERVICE_KEY = os.getenv("SUPABASE_SERVICE_KEY")
ML_API_KEY = os.getenv("ML_API_KEY")

supabase = create_client(SUPABASE_URL, SUPABASE_SERVICE_KEY)

app = FastAPI(title="PetLink ML API")

app.add_middleware(
    CORSMiddleware,
    # Regex instead of a fixed list: the dev machine's IP changes between
    # networks (WiFi vs hotspot vs VPN), and re-editing this file every time
    # it changes isn't worth it. Matches localhost/127.0.0.1/any 192.168.x.x
    # address on the common dev ports.
    allow_origin_regex=r"http://(localhost|127\.0\.0\.1|192\.168\.\d+\.\d+):(8080|5173|3000)",
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
def startup():
    ml.load_models()


def check_key(x_api_key: str = Header(None)):
    """Shared secret so random callers can't hammer the service."""
    if ML_API_KEY and x_api_key != ML_API_KEY:
        raise HTTPException(401, "Invalid API key")


@app.get("/health")
def health():
    return {"status": "ok", "device": str(ml.DEVICE), "threshold": ml.MATCH_THRESHOLD}


# ---------------------------------------------------------------------------
# Shared helper: given a found report's embedding and photo, notify the
# owner of the best-scoring lost report if it clears the threshold.
# Used by /match-found (found report arrives second) directly, and by
# /embed-lost (lost report arrives second) via the reverse comparison below.
# ---------------------------------------------------------------------------

def _email_top_match(lost_report_id: str, pet_name: str | None, score: float,
                      found_report: dict, crop_url: str):
    lost_row = supabase.table("pet_reports").select("pet_owner_id") \
        .eq("id", lost_report_id).execute()
    owner_id = lost_row.data[0].get("pet_owner_id") if lost_row.data else None
    if not owner_id:
        return

    profile = supabase.table("profiles").select("email") \
        .eq("id", owner_id).execute()
    owner_email = profile.data[0].get("email") if profile.data else None
    if not owner_email:
        return

    try:
        ml.send_match_email(
            to_email=owner_email,
            pet_name=pet_name,
            score=score,
            found_report={
                "photo_url": crop_url,
                "breed": found_report.get("breed"),
                "color": found_report.get("color"),
                "location": found_report.get("location"),
                "status": found_report.get("status"),
                "contact_info": found_report.get("contact_info"),
            },
        )
        # Email sent successfully - stamp when the owner was notified, so a
        # future "don't re-notify" check has something to compare against.
        supabase.table("matches").update({"notified_at": "now()"}) \
            .eq("lost_report_id", lost_report_id) \
            .eq("found_report_id", found_report.get("id")) \
            .execute()
    except Exception as e:
        # Don't fail the whole request just because email delivery had a
        # problem - the match is already saved in the `matches` table.
        print(f"Email send failed: {e}")


# ---------------------------------------------------------------------------
# Lost reports: photo -> embedding, stored so matching stays fast.
# Also checks the new embedding against every existing found report, for
# the case where a stray was found and reported before the owner got
# around to filing their lost report.
# ---------------------------------------------------------------------------

@app.post("/embed-lost/{report_id}")
async def embed_lost(report_id: str, x_api_key: str = Header(None)):
    check_key(x_api_key)

    res = supabase.table("pet_reports").select("*").eq("id", report_id).execute()
    if not res.data:
        raise HTTPException(404, "Report not found")
    report = res.data[0]

    if not report.get("photo_url"):
        raise HTTPException(400, "Report has no photo")

    async with httpx.AsyncClient() as client:
        r = await client.get(report["photo_url"])
        image = Image.open(io.BytesIO(r.content))

    # Crop to the dog if YOLO can find one. The owner's photo often has
    # background in it, and the model was trained on tight crops.
    crop, conf = ml.detect_and_crop_dog(np.array(image.convert("RGB")))
    target = crop if crop is not None else image

    embedding = ml.get_embedding(target)

    supabase.table("pet_reports").update({"embedding": embedding}).eq("id", report_id).execute()

    # Reverse-direction match check: compare against found reports that
    # already have an embedding (i.e. /match-found has already processed
    # their video at least once).
    found = supabase.table("pet_reports").select("id, embedding, photo_url, breed, color, location, status, contact_info") \
        .eq("type", "found").eq("is_reunited", False).execute()

    results = []
    for row in found.data:
        if not row.get("embedding"):
            continue
        score = ml.cosine_similarity(embedding, row["embedding"])
        results.append((row, score))

    results.sort(key=lambda pair: pair[1], reverse=True)

    matches_written = []
    for row, score in results[:5]:
        if score < ml.MATCH_THRESHOLD:
            continue
        supabase.table("matches").insert({
            "lost_report_id": report_id,
            "found_report_id": row["id"],
            "score": score,
            "status": "pending",
        }).execute()
        matches_written.append({"found_report_id": row["id"], "score": score})

    if matches_written:
        best_row, best_score = results[0]
        _email_top_match(
            lost_report_id=report_id,
            pet_name=report.get("pet_name"),
            score=best_score,
            found_report=best_row,
            crop_url=best_row.get("photo_url"),
        )

    return {
        "report_id": report_id,
        "dog_detected": crop is not None,
        "confidence": conf,
        "compared_against": len(results),
        "matches": matches_written,
    }


# ---------------------------------------------------------------------------
# Found reports: video -> best crop -> compare against every lost report
# ---------------------------------------------------------------------------

@app.post("/match-found/{report_id}")
async def match_found(report_id: str, x_api_key: str = Header(None)):
    check_key(x_api_key)

    res = supabase.table("pet_reports").select("*").eq("id", report_id).execute()
    if not res.data:
        raise HTTPException(404, "Report not found")
    report = res.data[0]

    if not report.get("video_url"):
        raise HTTPException(400, "Report has no video")

    # pet-videos is a private bucket, so this needs the service-role key
    video_bytes = supabase.storage.from_("pet-videos").download(report["video_url"])

    crop, conf = ml.best_crop_from_video(video_bytes)
    if crop is None:
        return {"matches": [], "reason": "no dog detected in video"}

    # Save the crop as the found report's photo so both sides have an image
    crop_img = Image.fromarray(crop)
    buf = io.BytesIO()
    crop_img.save(buf, format="JPEG")
    crop_path = f"crops/{report_id}.jpg"

    supabase.storage.from_("pet-photos").upload(
        crop_path, buf.getvalue(), {"content-type": "image/jpeg", "upsert": "true"}
    )
    crop_url = supabase.storage.from_("pet-photos").get_public_url(crop_path)

    found_emb = ml.get_embedding(crop)

    supabase.table("pet_reports").update({
        "photo_url": crop_url,
        "embedding": found_emb,
    }).eq("id", report_id).execute()

    # Compare against every lost report that still needs finding
    lost = supabase.table("pet_reports").select("id, pet_name, embedding, pet_owner_id") \
        .eq("type", "lost").eq("is_reunited", False).execute()

    results = []
    for row in lost.data:
        if not row.get("embedding"):
            continue  # embedding not computed yet

        score = ml.cosine_similarity(found_emb, row["embedding"])
        results.append({"lost_report_id": row["id"], "pet_name": row["pet_name"], "score": score})

    results.sort(key=lambda r: r["score"], reverse=True)

    # Write the ones over threshold into the matches table.
    # Top 5 only - the paper this design follows recommends surfacing a short
    # candidate list for the owner to confirm rather than one hard answer.
    written = []
    for r in results[:5]:
        if r["score"] < ml.MATCH_THRESHOLD:
            continue

        supabase.table("matches").insert({
            "lost_report_id": r["lost_report_id"],
            "found_report_id": report_id,
            "score": r["score"],
            "status": "pending",
        }).execute()
        written.append(r)

    # Only the top match gets an email - flooding the owner's inbox with five
    # near-duplicates for the same pet wouldn't help and would just get ignored.
    if written:
        top = written[0]
        _email_top_match(
            lost_report_id=top["lost_report_id"],
            pet_name=top["pet_name"],
            score=top["score"],
            found_report=report,
            crop_url=crop_url,
        )

    return {
        "found_report_id": report_id,
        "crop_confidence": conf,
        "crop_url": crop_url,
        "compared_against": len(results),
        "matches": written,
        "top_scores": results[:5],
    }