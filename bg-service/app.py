import hmac
import os

from fastapi import FastAPI, File, Header, HTTPException, UploadFile
from fastapi.responses import Response
from rembg import new_session, remove

app = FastAPI()

# The AI model loads once when the server starts.
session = new_session(os.getenv("MODEL_NAME", "u2netp"))

SECRET = os.getenv("API_SECRET", "")
MAX_BYTES = 5 * 1024 * 1024
ALLOWED = {"image/jpeg", "image/png", "image/webp"}


@app.get("/")
def health():
    return {"ok": True}


@app.post("/remove")
async def remove_bg(
    image: UploadFile = File(...),
    x_api_secret: str | None = Header(None),
):
    # Reject anyone who doesn't know the secret password.
    if not SECRET or not hmac.compare_digest(
        (x_api_secret or "").encode(), SECRET.encode()
    ):
        raise HTTPException(status_code=401, detail="Unauthorized")

    if image.content_type not in ALLOWED:
        raise HTTPException(status_code=400, detail="Unsupported image type")

    data = await image.read()
    if len(data) > MAX_BYTES:
        raise HTTPException(status_code=413, detail="Image too large")

    try:
        output = remove(data, session=session)
    except Exception:
        raise HTTPException(status_code=422, detail="Could not process image")

    return Response(content=output, media_type="image/png")
