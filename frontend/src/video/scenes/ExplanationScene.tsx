import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

interface ExplanationSceneProps {
  text: string;
  durationInFrames: number;
}

// Divide el texto en párrafos y los anima uno a uno
export const ExplanationScene: React.FC<ExplanationSceneProps> = ({
  text,
  durationInFrames,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const paragraphs = text
    .split(/\n+/)
    .map((p) => p.trim())
    .filter(Boolean)
    .slice(0, 5); // máximo 5 párrafos en pantalla

  const fadeOut = interpolate(
    frame,
    [durationInFrames - 20, durationInFrames],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  const headerOpacity = interpolate(frame, [0, 20], [0, 1], {
    extrapolateRight: "clamp",
  });

  // Barra de progreso superior
  const progressWidth = interpolate(frame, [0, durationInFrames], [0, 100], {
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#0a0e1a",
        padding: "60px 100px",
        opacity: fadeOut,
        flexDirection: "column",
      }}
    >
      {/* Progress bar */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          height: 3,
          width: `${progressWidth}%`,
          background: "linear-gradient(90deg, #4299E1, #63B3ED)",
        }}
      />

      {/* Header */}
      <div
        style={{
          opacity: headerOpacity,
          display: "flex",
          alignItems: "center",
          gap: 16,
          marginBottom: 48,
        }}
      >
        <div
          style={{
            width: 4,
            height: 36,
            borderRadius: 2,
            background: "linear-gradient(180deg, #63B3ED, #4299E1)",
          }}
        />
        <span
          style={{
            color: "#63B3ED",
            fontSize: 22,
            fontFamily: "monospace",
            letterSpacing: 2,
            textTransform: "uppercase",
          }}
        >
          Explicación
        </span>
      </div>

      {/* Párrafos animados */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 28 }}>
        {paragraphs.map((paragraph, i) => {
          const delay = i * 18;
          const paraOpacity = interpolate(
            frame,
            [delay, delay + 25],
            [0, 1],
            { extrapolateRight: "clamp", extrapolateLeft: "clamp" }
          );
          const paraX = interpolate(frame, [delay, delay + 25], [-30, 0], {
            extrapolateRight: "clamp",
            extrapolateLeft: "clamp",
          });

          return (
            <div
              key={i}
              style={{
                opacity: paraOpacity,
                transform: `translateX(${paraX}px)`,
                display: "flex",
                alignItems: "flex-start",
                gap: 20,
              }}
            >
              {/* Bullet point técnico */}
              <div
                style={{
                  marginTop: 10,
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  background: "#63B3ED",
                  flexShrink: 0,
                  boxShadow: "0 0 8px #63B3ED",
                }}
              />
              <p
                style={{
                  color: "rgba(226,232,240,0.9)",
                  fontSize: 30,
                  fontFamily: "'Inter', 'Helvetica Neue', sans-serif",
                  fontWeight: 300,
                  lineHeight: 1.6,
                  margin: 0,
                }}
              >
                {paragraph}
              </p>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};