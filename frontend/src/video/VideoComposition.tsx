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

export interface VideoCompositionProps {
  script: {
    title: string;
    sections: Record<string, ScriptSection>;
  };
  audioPaths: Record<string, string>;
  templateId?: "minimalist" | "academic" | "impact";
  orientation?: "horizontal" | "vertical";
}

export const VideoComposition: React.FC<VideoCompositionProps> = ({
  script,
  audioPaths,
  templateId = "academic",
}) => {
  const props = { script, audioPaths };

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
