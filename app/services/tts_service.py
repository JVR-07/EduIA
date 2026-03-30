from gtts import gTTS
import os

# Carpeta donde se guardarán los audios
OUTPUT_DIR = "output/audio"


def generar_audio(texto: str, nombre_archivo: str) -> str:
    """
    Genera un archivo de audio a partir de texto.
    """

    # Crear carpeta si no existe
    if not os.path.exists(OUTPUT_DIR):
        os.makedirs(OUTPUT_DIR)

    # Limitar longitud (gTTS falla con textos muy largos)
    texto = texto[:1500]

    ruta = os.path.join(OUTPUT_DIR, f"{nombre_archivo}.mp3")

    try:
        tts = gTTS(text=texto, lang="es")
        tts.save(ruta)
        return ruta

    except Exception as e:
        print("Error generando audio:", e)
        return None


def generar_audios_desde_guion(guion: dict) -> dict:
    rutas = {}

    for seccion, contenido in guion.items():
        # Si el contenido es dict (nuevo formato), extraer el texto
        if isinstance(contenido, dict):
            texto = contenido.get("text", "")
        else:
            texto = contenido  # compatibilidad con formato anterior

        if texto:
            ruta = generar_audio(texto, seccion)
            rutas[seccion] = ruta
        else:
            rutas[seccion] = None

    return rutas