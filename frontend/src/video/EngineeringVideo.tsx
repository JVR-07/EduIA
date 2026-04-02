import React from "react";
import { AbsoluteFill, Audio, Sequence, useVideoConfig } from "remotion";
import { IntroScene } from "./scenes/IntroScene";
import { ExplanationScene } from "./scenes/ExplanationScene";
import { ExampleScene } from "./scenes/ExampleScene";
import { ConclusionScene } from "./scenes/ConclusionScene";

export interface ScriptSection {
  text: string;
  duration: number; // segundos
  charts?: ChartData[];
}

export interface ChartData {
  type: "bar" | "line" | "pie";
  title: string;
  data: { name: string; value: number }[];
}

export interface DynamicSceneData {
  id: string;
  type: "title" | "concept" | "bullets" | "chart" | "question" | "code" | "quote";
  duration: number; // segundos
  [key: string]: any;
}

export interface EngineeringVideoProps {
  script: {
    title: string;
    sections?: {
      introduccion: ScriptSection;
      explicacion: ScriptSection;
      ejemplo: ScriptSection;
      conclusion: ScriptSection;
    };
    scenes?: DynamicSceneData[];
  };
  audioPaths: Record<string, string>;
}

export const EngineeringVideo: React.FC<EngineeringVideoProps> = ({
  script,
  audioPaths,
}) => {
  const { fps } = useVideoConfig();
  const s = script.sections;

  const introFrames = s.introduccion.duration * fps;
  const explFrames = s.explicacion.duration * fps;
  const exampleFrames = s.ejemplo.duration * fps;
  const conclusionFrames = s.conclusion.duration * fps;

  return (
    <AbsoluteFill style={{ backgroundColor: "#0a0e1a" }}>
      {/* Introducción */}
      <Sequence from={0} durationInFrames={introFrames}>
        {audioPaths.introduccion && (
          <Audio src={audioPaths.introduccion} />
        )}
        <IntroScene
          title={script.title}
          text={s.introduccion.text}
          durationInFrames={introFrames}
        />
      </Sequence>

      {/* Explicación */}
      <Sequence from={introFrames} durationInFrames={explFrames}>
        {audioPaths.explicacion && (
          <Audio src={audioPaths.explicacion} />
        )}
        <ExplanationScene
          text={s.explicacion.text}
          durationInFrames={explFrames}
        />
      </Sequence>

      {/* Ejemplo con gráficas */}
      <Sequence from={introFrames + explFrames} durationInFrames={exampleFrames}>
        {audioPaths.ejemplo && (
          <Audio src={audioPaths.ejemplo} />
        )}
        <ExampleScene
          text={s.ejemplo.text}
          charts={s.ejemplo.charts || []}
          durationInFrames={exampleFrames}
        />
      </Sequence>

      {/* Conclusión */}
      <Sequence
        from={introFrames + explFrames + exampleFrames}
        durationInFrames={conclusionFrames}
      >
        {audioPaths.conclusion && (
          <Audio src={audioPaths.conclusion} />
        )}
        <ConclusionScene
          text={s.conclusion.text}
          durationInFrames={conclusionFrames}
        />
      </Sequence>
    </AbsoluteFill>
  );
};
