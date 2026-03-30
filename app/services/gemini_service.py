import google.generativeai as genai
import os
import json
from models.schemas import VideoRequest, Language, Level, VideoStyle, DurationHint

genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
model = genai.GenerativeModel("gemini-2.5-flash")


def _get_language_label(lang: Language) -> str:
    return "Spanish" if lang == Language.spanish else "English"


def _get_level_label(level: Level) -> str:
    return {"basic": "Beginner", "intermediate": "Intermediate", "advanced": "Advanced"}[level]


def _get_style_label(style: VideoStyle) -> str:
    return {
        "explanatory": "clear and explanatory, breaking down concepts step by step",
        "narrative": "narrative and storytelling, engaging with real-world examples",
        "tutorial": "step-by-step tutorial, practical and hands-on"
    }[style]


def _get_duration_config(hint: DurationHint) -> dict:
    configs = {
        "short":    {"intro": 8,  "expl": 12, "example": 12, "conclusion": 6},
        "standard": {"intro": 10, "expl": 20, "example": 20, "conclusion": 8},
        "long":     {"intro": 15, "expl": 35, "example": 35, "conclusion": 12},
    }
    return configs[hint]


def generar_guion(request: VideoRequest) -> dict:
    lang = _get_language_label(request.language)
    level = _get_level_label(request.level)
    style = _get_style_label(request.style)
    durations = _get_duration_config(request.duration_hint)

    audience_line = f"Target audience: {request.target_audience}" if request.target_audience else ""
    notes_line = f"Additional instructions: {request.extra_notes}" if request.extra_notes else ""

    prompt = f"""
    Return ONLY valid JSON, no extra text, no code fences.

    Generate an educational video script about: "{request.topic}"

    Script requirements:
    - Language: {lang}
    - Level: {level}
    - Style: {style}
    {audience_line}
    {notes_line}

    Exact JSON format:

    {{
      "title": "{request.topic}",
      "introduccion": {{
        "text": "Introduction text ({durations['intro']}-{durations['intro']+5}s of content). Engaging hook for a {level} audience.",
        "duration": {durations['intro']}
      }},
      "explicacion": {{
        "text": "Technical explanation in {lang}. Use \\n to separate paragraphs or key points. Adapt complexity to {level} level.",
        "duration": {durations['expl']}
      }},
      "ejemplo": {{
        "text": "Practical example description.",
        "duration": {durations['example']},
        "charts": [
          {{
            "type": "bar",
            "title": "Chart title",
            "data": [
              {{"name": "Case A", "value": 85}},
              {{"name": "Case B", "value": 62}},
              {{"name": "Case C", "value": 91}}
            ]
          }}
        ]
      }},
      "conclusion": {{
        "text": "Conclusion summarizing key takeaways. Separate points with periods.",
        "duration": {durations['conclusion']}
      }}
    }}

    Instructions:
    - Write everything in {lang}.
    - Adjust "duration" values (in seconds) based on text length.
    - In "charts", include real numeric data relevant to the topic "{request.topic}".
    - Use "type": "bar" or "type": "line" as appropriate.
    - If the topic has no obvious comparative data, invent coherent illustrative data.
    - Adapt vocabulary and depth to a {level} audience.
    - Use a {style} tone throughout.
    """

    response = model.generate_content(prompt)

    try:
        texto = response.candidates[0].content.parts[0].text
        print("RAW:", texto)

        limpio = texto.strip()
        if limpio.startswith("```"):
            limpio = limpio.replace("```json", "").replace("```", "").strip()

        data = json.loads(limpio)
        return data

    except Exception as e:
        print("Error parseando:", e)
        return texto  # fallback