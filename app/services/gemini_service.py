import google.generativeai as genai
import os
import json
from models.schemas import VideoRequest, Language, Level, VideoStyle, DurationHint

genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
GEMINI_MODEL = os.getenv("GEMINI_MODEL", "gemini-2.0-flash")
model = genai.GenerativeModel(GEMINI_MODEL)


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


def _get_duration_config(hint: DurationHint) -> int:
    configs = {
        "short":    120,
        "standard": 240,
        "long":     420,
    }
    return configs[hint]


def generar_guion(request: VideoRequest) -> dict:
    lang = _get_language_label(request.language)
    level = _get_level_label(request.level)
    style = _get_style_label(request.style)
    total_duration = _get_duration_config(request.duration_hint)

    audience_line = f"Target audience: {request.target_audience}" if request.target_audience else ""
    notes_line = f"Additional instructions: {request.extra_notes}" if request.extra_notes else ""

    prompt = f"""
    Return ONLY valid JSON, no extra text, no code fences.

    Generate an educational video script about: "{request.topic}"

    Script requirements:
    - Language: {lang}
    - Level: {level}
    - Style: {style}
    - Total estimated duration: ~{total_duration} seconds (adjust scene durations roughly to match this)
    {audience_line}
    {notes_line}

    Exact JSON format:

    {{
      "title": "{request.topic}",
      "scenes": [
        {{
          "id": "scene_1",
          "type": "title",
          "text": "Short engaging title text",
          "spoken_text": "Spoken introduction for the voiceover...",
          "duration": 10
        }},
        {{
          "id": "scene_2",
          "type": "concept",
          "text": "Main Concept Keyword",
          "spoken_text": "Explanation of the concept...",
          "duration": 15
        }},
        {{
          "id": "scene_3",
          "type": "bullets",
          "title": "Key Points",
          "items": ["Point 1", "Point 2", "Point 3"],
          "spoken_text": "Here are the key points to consider...",
          "duration": 20
        }},
        {{
          "id": "scene_4",
          "type": "chart",
          "title": "Relevant Data Insight",
          "chart_type": "bar",
          "data": [
            {{"name": "A", "value": 10}},
            {{"name": "B", "value": 20}}
          ],
          "spoken_text": "As we can see in the chart...",
          "duration": 25
        }},
        {{
          "id": "scene_5",
          "type": "question",
          "text": "Thought provoking question?",
          "spoken_text": "But wait, have you ever wondered...",
          "duration": 10
        }},
        {{
          "id": "scene_6",
          "type": "code",
          "code": "print('Hello World')",
          "language": "python",
          "spoken_text": "Let's look at a simple code example...",
          "duration": 15
        }},
        {{
          "id": "scene_7",
          "type": "quote",
          "text": "Important quote or conclusion",
          "author": "Author Name (optional)",
          "spoken_text": "To summarize, as the famous saying goes...",
          "duration": 12
        }},
        {{
          "id": "scene_8",
          "type": "outro",
          "text": "Thanks for watching!",
          "spoken_text": "I hope you enjoyed this video. Don't forget to like and subscribe for more educational content!",
          "duration": 10
        }}
      ]
    }}

    Instructions:
    - Write everything in {lang}.
    - The JSON MUST contain an array "scenes".
    - You can use any combination of the following scene types: "title", "concept", "bullets", "chart", "question", "code", "quote", "outro".
    - Use "outro" as the final scene for a warm closing.
    - Use the different scene types dynamically to make the video engaging. Choose the types that best fit the current concept and {style} style.
    - Vary the number of scenes depending on the total duration matching {total_duration}s.
    - KEEP "text" fields extremely concise (these are shown on screen). Put all the detailed explanation in "spoken_text" (what the AI voice will say).
    - In "chart" scenes, include real numeric data relevant to the topic "{request.topic}" or invent coherent illustrative data. Chart types can be "bar" or "line".
    - Output ONLY the raw JSON string. Do not use Markdown formatting like ```json.
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