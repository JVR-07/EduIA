import os
from dotenv import load_dotenv

# Cargar .env desde el directorio padre
load_dotenv(os.path.join(os.path.dirname(__file__), '..', '.env'))

from fastapi.staticfiles import StaticFiles
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes import video

import os

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

audio_dir = os.getenv("AUDIO_OUTPUT_DIR", "outputs/audio")
os.makedirs(audio_dir, exist_ok=True)
app.mount("/audio", StaticFiles(directory=audio_dir), name="audio")
app.include_router(video.router)        