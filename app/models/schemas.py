from pydantic import BaseModel
from typing import Optional
from enum import Enum


class Language(str, Enum):
    spanish = "es"
    english = "en"


class Level(str, Enum):
    basic = "basic"
    intermediate = "intermediate"
    advanced = "advanced"


class VideoStyle(str, Enum):
    explanatory = "explanatory"
    narrative = "narrative"
    tutorial = "tutorial"


class DurationHint(str, Enum):
    short = "short"      # ~2 min
    standard = "standard"  # ~4 min
    long = "long"         # ~7 min


class Orientation(str, Enum):
    horizontal = "horizontal"  # 1280x720 (16:9)
    vertical = "vertical"      # 720x1280 (9:16)


class Template(str, Enum):
    minimalist = "minimalist"
    academic = "academic"
    impact = "impact"


class VideoRequest(BaseModel):
    topic: str
    language: Language = Language.spanish
    level: Level = Level.intermediate
    style: VideoStyle = VideoStyle.explanatory
    duration_hint: DurationHint = DurationHint.standard
    orientation: Orientation = Orientation.horizontal
    template: Template = Template.academic
    target_audience: Optional[str] = None
    extra_notes: Optional[str] = None


# Alias for backwards compatibility
TopicRequest = VideoRequest