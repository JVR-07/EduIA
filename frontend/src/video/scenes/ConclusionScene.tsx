import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

interface ConclusionSceneProps {
  text: string;
  durationInFrames: number;
}

export const ConclusionScene: React.FC<ConclusionSceneProps> = ({
  text,
  durationInFrames, 
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const fadeOut = interpolate(
    frame,
    [durationInFrames - 25, durationInFrames],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  const headerOpacity = interpolate(frame, [0, 20], [0, 1], {
    extrapolateRight: "clamp",
  });

  // Puntos clave extraídos del texto (split por punto o coma)
  const keyPoints = text
    .split(/[.;]/)
    .map((s) => s.trim())
    .filter((s) => s.length > 15)
    .slice(0, 4);

  const scale = spring({
    frame,
    fps,
    config: { damping: 16, stiffness: 60 },
    from: 0.85,
    to: 1,
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
      {/* Background decorativo */}
      <svg
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          pointerEvents: "none",
        }}
      >
        <circle cx="1100" cy="100" r="300" fill="rgba(99,179,237,0.03)" />
        <circle cx="1000" cy="500" r="200" fill="rgba(72,187,120,0.03)" />
      </svg>

      {/* Header */}
      <div
        style={{
          opacity: headerOpacity,
          display: "flex",
          alignItems: "center",
          gap: 16,
          marginBottom: 52,
        }}
      >
        <div
          style={{
            width: 4,
            height: 36,
            borderRadius: 2,
            background: "linear-gradient(180deg, #F6AD55, #ED8936)",
          }}
        />
        <span
          style={{
            color: "#F6AD55",
            fontSize: 22,
            fontFamily: "monospace",
            letterSpacing: 2,
            textTransform: "uppercase",
          }}
        >
          Conclusión
        </span>
      </div>

      {/* Cards de puntos clave */}
      <div
        style={{
          transform: `scale(${scale})`,
          display: "grid",
          gridTemplateColumns: keyPoints.length > 2 ? "1fr 1fr" : "1fr",
          gap: 24,
          flex: 1,
        }}
      >
        {keyPoints.map((point, i) => {
          const cardDelay = i * 15;
          const cardOpacity = interpolate(
            frame,
            [cardDelay, cardDelay + 25],
            [0, 1],
            { extrapolateRight: "clamp", extrapolateLeft: "clamp" }
          );
          const cardY = interpolate(
            frame,
            [cardDelay, cardDelay + 25],
            [20, 0],
            { extrapolateRight: "clamp", extrapolateLeft: "clamp" }
          );

          const accentColors = ["#63B3ED", "#48BB78", "#F6AD55", "#B794F4"];
          const color = accentColors[i % accentColors.length];

          return (
            <div
              key={i}
              style={{
                opacity: cardOpacity,
                transform: `translateY(${cardY}px)`,
                padding: "28px 32px",
                borderRadius: 12,
                border: `1px solid ${color}30`,
                background: `${color}08`,
                display: "flex",
                alignItems: "flex-start",
                gap: 20,
              }}
            >
              <div
                style={{
                  marginTop: 6,
                  width: 10,
                  height: 10,
                  borderRadius: "50%",
                  background: color,
                  flexShrink: 0,
                  boxShadow: `0 0 10px ${color}`,
                }}
              />
              <p
                style={{
                  color: "rgba(226,232,240,0.9)",
                  fontSize: 26,
                  fontFamily: "'Inter', 'Helvetica Neue', sans-serif",
                  fontWeight: 300,
                  lineHeight: 1.5,
                  margin: 0,
                }}
              >
                {point}
              </p>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};