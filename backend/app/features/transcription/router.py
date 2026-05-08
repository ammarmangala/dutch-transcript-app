from fastapi import APIRouter, HTTPException, UploadFile, status

from .schemas import TranscribeResponse
from .service import transcribe

ALLOWED_MIME_TYPES = {
    "audio/mpeg", "audio/mp3", "audio/mp4", "audio/wav",
    "audio/webm", "audio/x-m4a", "audio/ogg", "video/webm",
}
MAX_BYTES = 25 * 1024 * 1024  # 25 MB

router = APIRouter(tags=["transcription"])


@router.post("/transcribe", response_model=TranscribeResponse)
async def transcribe_audio(file: UploadFile) -> TranscribeResponse:
    content_type = (file.content_type or "").split(";")[0].strip().lower()
    if content_type not in ALLOWED_MIME_TYPES:
        raise HTTPException(
            status_code=status.HTTP_415_UNSUPPORTED_MEDIA_TYPE,
            detail=f"Bestandstype niet ondersteund: {file.content_type}",
        )

    audio_bytes = await file.read()

    if len(audio_bytes) > MAX_BYTES:
        raise HTTPException(
            status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
            detail=f"Bestand te groot: {len(audio_bytes) / 1024 / 1024:.1f} MB, max 25 MB.",
        )

    try:
        text = transcribe(audio_bytes, file.filename or "audio.webm")
    except Exception as exc:
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail="Transcriptie mislukt. Probeer het opnieuw.",
        ) from exc

    return TranscribeResponse(text=text)
