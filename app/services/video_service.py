"""
video_service.py
Orquesta la generación de video llamando al servidor Remotion.

Recibe el JSON del guión (de ai_service) y las rutas de los
audios (de tts_service) y devuelve la ruta del MP4 generado.
"""

import os
import time
import json
import logging
import requests
from pathlib import Path
from typing import Optional

logger = logging.getLogger(__name__)

REMOTION_SERVER_URL = os.getenv("REMOTION_SERVER_URL")
OUTPUT_DIR = Path(os.getenv("VIDEO_OUTPUT_DIR", "outputs/videos"))
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
BACKEND_URL = os.getenv("BACKEND_URL")

class VideoService:
    def __init__(self, server_url: str = REMOTION_SERVER_URL):
        self.server_url = server_url

    # ------------------------------------------------------------------
    # Método principal
    # ------------------------------------------------------------------
    def generate_video(
        self,
        script: dict,
        audio_paths: dict,
        template_id: str = "academic",
        orientation: str = "horizontal",
        output_name: Optional[str] = None,
    ) -> str:
        """
        Genera un video a partir del guión y los audios.

        Args:
            script: dict con la estructura del guión de Gemini.
            audio_paths: dict con rutas absolutas a los MP3.
            template_id: ID de la plantilla a usar.
            orientation: horizontal o vertical.
            output_name: nombre del archivo MP4 de salida.

        Returns:
            Ruta absoluta al video MP4 generado.
        """
        if not output_name:
            timestamp = int(time.time())
            safe_title = script.get("title", "video").replace(" ", "_")[:30]
            output_name = f"{safe_title}_{timestamp}.mp4"

        # Verificar que el servidor Remotion está disponible
        self._check_server_health()

        # Construir payload para Remotion
        payload = self._build_payload(script, audio_paths, template_id, orientation, output_name)

        logger.info(f"Enviando request de render a Remotion: {output_name} (template={template_id}, orientation={orientation})")
        start = time.time()

        response = requests.post(
            f"{self.server_url}/render",
            json=payload,
            timeout=600,  # 10 min timeout para renders largos
        )
        response.raise_for_status()
        result = response.json()

        if not result.get("success"):
            raise RuntimeError(f"Error en Remotion render: {result.get('error')}")

        elapsed = time.time() - start
        output_path = result["outputPath"]
        logger.info(f"Video generado en {elapsed:.1f}s: {output_path}")

        return output_path

    # ------------------------------------------------------------------
    # Helpers
    # ------------------------------------------------------------------
    def _check_server_health(self) -> None:
        """Verifica que el servidor Remotion esté corriendo."""
        try:
            r = requests.get(f"{self.server_url}/health", timeout=5)
            r.raise_for_status()
        except requests.exceptions.ConnectionError:
            raise ConnectionError(
                f"El servidor Remotion no está disponible en {self.server_url}.\n"
                "Asegúrate de correr: npm run server (en el directorio remotion/)"
            )

    def _get_audio_duration(self, path: str) -> float:
        """Obtiene la duración de un audio en segundos usando ffprobe."""
        import subprocess
        try:
            cmd = [
                "ffprobe", "-v", "error", "-show_entries", "format=duration",
                "-of", "default=noprint_wrappers=1:nokey=1", path
            ]
            result = subprocess.run(cmd, stdout=subprocess.PIPE, stderr=subprocess.STDOUT, text=True)
            return float(result.stdout.strip())
        except Exception as e:
            logger.error(f"Error midiendo duración de audio {path}: {e}")
            return 0.0

    def _build_payload(self, script: dict, audio_paths: dict, template_id: str, orientation: str, output_name: str) -> dict:
         # Convertir rutas locales a URLs HTTP
        http_audio_paths = {}
        for key, path in audio_paths.items():
            if path:
                filename = Path(path).name  # ej: "scene_1.mp3"
                http_audio_paths[key] = f"{BACKEND_URL}/audio/{filename}"
            else:
                http_audio_paths[key] = ""
            
        if "scenes" in script:
            scenes = script["scenes"]
            for idx, scene in enumerate(scenes):
                scene_id = scene.get("id", f"scene_{idx}")
                audio_local_path = audio_paths.get(scene_id)
                
                # Intentar obtener duración real del audio
                audio_dur = 0.0
                if audio_local_path and os.path.exists(audio_local_path):
                    audio_dur = self._get_audio_duration(audio_local_path)
                
                if audio_dur > 0:
                    # Usar duración real + buffer de 0.5s para que no se corte
                    scene["duration"] = audio_dur + 0.5
                elif "duration" not in scene:
                    texto = scene.get("spoken_text", scene.get("text", ""))
                    words = len(texto.split())
                    scene["duration"] = max(8, int(words * 0.46))
            
            return {
                "title": script.get("title", script.get("tema", "Sin título")),
                "scenes": scenes,
                "audioPaths": http_audio_paths,
                "templateId": template_id,
                "orientation": orientation,
                "outputName": output_name,
            }

        """
        Fallback a legacy Format. Convertir el JSON de Gemini al formato que espera Remotion.
        """
        sections = {}
        for key in ["introduccion", "explicacion", "ejemplo", "conclusion"]:
            section_data = script.get(key, {})

            if isinstance(section_data, str):
                text = section_data
                data = {"text": text}
            else:
                text = section_data.get("text", section_data.get("contenido", ""))
                data = dict(section_data)
                data["text"] = text

            if "duration" not in data:
                words = len(text.split())
                data["duration"] = max(8, int(words * 0.46))

            if key == "ejemplo" and "charts" not in data:
                data["charts"] = self._extract_charts_from_script(script)

            sections[key] = data

        return {
            "title": script.get("title", script.get("tema", "Sin título")),
            "sections": sections,
            "audioPaths": http_audio_paths,
            "templateId": template_id,
            "orientation": orientation,
            "outputName": output_name,
        }

    def _extract_charts_from_script(self, script: dict) -> list:
        """
        Si el JSON de Gemini incluye datos numéricos en el ejemplo,
        los extrae como configuración de gráfica para Recharts.
        """
        charts = []

        # Buscar clave "datos" o "grafica" que Gemini pueda incluir
        ejemplo = script.get("ejemplo", {})
        if isinstance(ejemplo, dict):
            raw_charts = ejemplo.get("datos", ejemplo.get("grafica", []))
            if isinstance(raw_charts, list):
                charts = raw_charts

        return charts


# ------------------------------------------------------------------
# Función de conveniencia para usar directamente desde routes/video.py
# ------------------------------------------------------------------
_service = VideoService()


def generate_video(script: dict, audio_paths: dict, template_id: str = "academic", orientation: str = "horizontal", output_name: str = None) -> str:
    return _service.generate_video(script, audio_paths, template_id, orientation, output_name)
