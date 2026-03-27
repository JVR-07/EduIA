import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

interface IntroSceneProps {
  title: string;
  text: string;
  durationInFrames: number;
}

export const IntroScene: React.FC<IntroSceneProps> = ({
  title,
  text,
  durationInFrames,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Entrada del título con spring
  const titleScale = spring({
    frame,
    fps,
    config: { damping: 14, stiffness: 80 },
    from: 0.6,
    to: 1,
  });

  const titleOpacity = interpolate(frame, [0, 20], [0, 1], {
    extrapolateRight: "clamp",
  });

  // Entrada del subtítulo con delay
  const subtitleOpacity = interpolate(frame, [30, 55], [0, 1], {
    extrapolateRight: "clamp",
  });
  const subtitleY = interpolate(frame, [30, 55], [20, 0], {
    extrapolateRight: "clamp",
  });

  // Línea decorativa animada
  const lineWidth = interpolate(frame, [20, 50], [0, 300], {
    extrapolateRight: "clamp",
  });

  // Fade out al final
  const fadeOut = interpolate(
    frame,
    [durationInFrames - 20, durationInFrames],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // Partículas de fondo (puntos estáticos animados)
  const particles = React.useMemo(
    () =>
      Array.from({ length: 40 }, (_, i) => ({
        x: (i * 137.5) % 100,
        y: (i * 97.3) % 100,
        size: 1 + (i % 3),
        phase: i * 0.4,
      })),
    []
  );

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#0a0e1a",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        opacity: fadeOut,
      }}
    >
      {/* Grid de fondo */}
      <svg
        style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%" }}
      >
        <defs>
          <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
            <path
              d="M 60 0 L 0 0 0 60"
              fill="none"
              stroke="rgba(99,179,237,0.06)"
              strokeWidth="1"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />

        {/* Partículas */}
        {particles.map((p, i) => (
          <circle
            key={i}
            cx={`${p.x}%`}
            cy={`${p.y}%`}
            r={p.size}
            fill="rgba(99,179,237,0.3)"
            opacity={0.3 + 0.3 * Math.sin((frame / 30) * 0.8 + p.phase)}
          />
        ))}

        {/* Línea de acento horizontal */}
        <line
          x1={640 - lineWidth / 2}
          y1={390}
          x2={640 + lineWidth / 2}
          y2={390}
          stroke="url(#accentGrad)"
          strokeWidth="2"
        />
        <defs>
          <linearGradient id="accentGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#4299E1" stopOpacity="0" />
            <stop offset="50%" stopColor="#63B3ED" stopOpacity="1" />
            <stop offset="100%" stopColor="#4299E1" stopOpacity="0" />
          </linearGradient>
        </defs>
      </svg>

      {/* Badge "Ingeniería" */}
      <div
        style={{
          opacity: titleOpacity,
          marginBottom: 24,
          padding: "6px 20px",
          borderRadius: 20,
          border: "1px solid rgba(99,179,237,0.4)",
          color: "#63B3ED",
          fontSize: 18,
          fontFamily: "monospace",
          letterSpacing: 3,
          textTransform: "uppercase",
        }}
      >
        Ingeniería
      </div>

      {/* Título principal */}
      <div
        style={{
          transform: `scale(${titleScale})`,
          opacity: titleOpacity,
          color: "#F7FAFC",
          fontSize: 72,
          fontFamily: "'Inter', 'Helvetica Neue', sans-serif",
          fontWeight: 800,
          textAlign: "center",
          maxWidth: 960,
          lineHeight: 1.1,
          padding: "0 40px",
          background: "linear-gradient(135deg, #F7FAFC 40%, #63B3ED 100%)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
        }}
      >
        {title}
      </div>

      {/* Subtítulo / intro text */}
      <div
        style={{
          opacity: subtitleOpacity,
          transform: `translateY(${subtitleY}px)`,
          color: "rgba(226,232,240,0.75)",
          fontSize: 28,
          fontFamily: "'Inter', 'Helvetica Neue', sans-serif",
          fontWeight: 300,
          textAlign: "center",
          maxWidth: 800,
          lineHeight: 1.6,
          marginTop: 32,
          padding: "0 40px",
        }}
      >
        {text}
      </div>
    </AbsoluteFill>
  );
};