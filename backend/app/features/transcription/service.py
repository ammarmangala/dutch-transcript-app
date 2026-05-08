import io

from openai import OpenAI

from ...config import settings

_client: OpenAI | None = None


def _get_openai() -> OpenAI:
    global _client
    if _client is None:
        _client = OpenAI(api_key=settings.openai_api_key)
    return _client


def transcribe(audio_bytes: bytes, filename: str) -> str:
    audio_file = io.BytesIO(audio_bytes)
    audio_file.name = filename
    response = _get_openai().audio.transcriptions.create(
        model="gpt-4o-mini-transcribe",
        file=audio_file,
        language="nl",
    )
    return response.text
