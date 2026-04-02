/**
 * VideoComposition — selector that picks the right template
 * based on templateId and orientation props.
 */
import React from "react";
import { AbsoluteFill } from "remotion";
import { MinimalistTemplate } from "./templates/MinimalistTemplate";
import { AcademicTemplate } from "./templates/AcademicTemplate";
import { ImpactTemplate } from "./templates/ImpactTemplate";

interface ScriptSection {
  text: string;
  duration: number;
  charts?: {
    type: "bar" | "line";
    title: string;
    data: { name: string; value: number }[];
  }[];
}

export interface DynamicSceneData {
  id: string;
  type: "title" | "concept" | "bullets" | "chart" | "question" | "code" | "quote";
  duration: number;
  [key: string]: any;
}

export interface VideoCompositionProps {
  script: {
    title: string;
    sections?: Record<string, ScriptSection>;
    scenes?: DynamicSceneData[];
  };
  audioPaths: Record<string, string>;
  templateId?: "minimalist" | "academic" | "impact";
  orientation?: "horizontal" | "vertical";
}

export const VideoComposition: React.FC<VideoCompositionProps> = ({
  script,
  audioPaths,
  templateId = "academic",
  orientation = "horizontal",
}) => {
  const props = { script, audioPaths, orientation };

  switch (templateId) {
    case "minimalist":
      return <MinimalistTemplate {...props} />;
    case "impact":
      return <ImpactTemplate {...props} />;
    case "academic":
    default:
      return <AcademicTemplate {...props} />;
  }
};
