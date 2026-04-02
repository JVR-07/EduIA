import json
import time
import uuid
from pathlib import Path
from fastapi import APIRouter
from fastapi.responses import JSONResponse
from services.gemini_service import generar_guion
from services.tts_service import generar_audios_desde_guion
from models.schemas import VideoRequest
from services.video_service import generate_video

router = APIRouter(prefix="/video", tags=["Video"])

# History stored in a JSON file on disk
HISTORY_FILE = Path("outputs/history.json")
HISTORY_FILE.parent.mkdir(parents=True, exist_ok=True)


def _load_history() -> list:
    if HISTORY_FILE.exists():
        try:
            return json.loads(HISTORY_FILE.read_text(encoding="utf-8"))
        except Exception:
            return []
    return []


def _save_history(history: list) -> None:
    HISTORY_FILE.write_text(json.dumps(history, ensure_ascii=False, indent=2), encoding="utf-8")


@router.get("/history")
def get_history():
    """Returns all generated videos with their input parameters and script."""
    history = _load_history()
    return {"videos": history}


@router.get("/{video_id}")
def get_video(video_id: str):
    """Returns a single video entry by ID."""
    history = _load_history()
    for entry in history:
        if entry["id"] == video_id:
            return entry
    return JSONResponse(status_code=404, content={"error": "Video not found"})


@router.post("/generate-script")
def generate_script(data: VideoRequest):
    guion = generar_guion(data)

    # Validación básica
    if not isinstance(guion, dict):
        return {
            "error": "El guion no es válido",
            "raw": guion
        }

    audios = generar_audios_desde_guion(guion)
    video = generate_video(guion, audios, template_id=data.template.value, orientation=data.orientation.value)

    # Build history entry
    video_id = str(uuid.uuid4())
    entry = {
        "id": video_id,
        "created_at": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
        "inputs": {
            "topic": data.topic,
            "language": data.language,
            "level": data.level,
            "style": data.style,
            "duration_hint": data.duration_hint,
            "orientation": data.orientation,
            "template": data.template,
            "target_audience": data.target_audience,
            "extra_notes": data.extra_notes,
        },
        "script": guion,
        "audio_files": audios,
        "video_path": video if isinstance(video, str) else None,
        "status": "completed",
    }

    history = _load_history()
    history.insert(0, entry)  # newest first
    _save_history(history)

    return {
        "id": video_id,
        "script": guion,
        "audio_files": audios,
    }