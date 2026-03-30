import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

// ── Paleta verde ──────────────────────────────────────────
export const GREEN = {
  bg: "#060d06",
  surface: "#0e1a0e",
  primary: "#22c55e",
  primaryLight: "#4ade80",
  primaryDim: "rgba(34,197,94,0.15)",
  text: "#f0fdf4",
  muted: "rgba(240,253,244,0.55)",
  border: "rgba(34,197,94,0.18)",
};

// ── Shared animated background ────────────────────────────
interface BgProps {
  frame: number;
  showGrid?: boolean;
  showParticles?: boolean;
  particleCount?: number;
}

export function AnimatedBg({
  frame,
  showGrid = true,
  showParticles = true,
  particleCount = 30,
}: BgProps) {
  const particles = React.useMemo(
    () =>
      Array.from({ length: particleCount }, (_, i) => ({
        x: (i * 137.5) % 100,
        y: (i * 97.3) % 100,
        size: 1 + (i % 3),
        phase: i * 0.5,
      })),
    [particleCount],
  );

  return (
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
      <defs>
        {showGrid && (
          <pattern
            id="grid"
            width="50"
            height="50"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M 50 0 L 0 0 0 50"
              fill="none"
              stroke={GREEN.border}
              strokeWidth="0.5"
            />
          </pattern>
        )}
        <radialGradient id="glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={GREEN.primary} stopOpacity="0.08" />
          <stop offset="100%" stopColor={GREEN.primary} stopOpacity="0" />
        </radialGradient>
        <linearGradient id="accentLine" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor={GREEN.primary} stopOpacity="0" />
          <stop offset="50%" stopColor={GREEN.primaryLight} stopOpacity="1" />
          <stop offset="100%" stopColor={GREEN.primary} stopOpacity="0" />
        </linearGradient>
      </defs>
      {showGrid && <rect width="100%" height="100%" fill="url(#grid)" />}
      <rect width="100%" height="100%" fill="url(#glow)" />
      {showParticles &&
        particles.map((p, i) => (
          <circle
            key={i}
            cx={`${p.x}%`}
            cy={`${p.y}%`}
            r={p.size}
            fill={GREEN.primaryLight}
            opacity={0.15 + 0.2 * Math.sin((frame / 30) * 0.6 + p.phase)}
          />
        ))}
    </svg>
  );
}

// ── Progress bar ──────────────────────────────────────────
export function ProgressBar({
  frame,
  durationInFrames,
}: {
  frame: number;
  durationInFrames: number;
}) {
  const w = interpolate(frame, [0, durationInFrames], [0, 100], {
    extrapolateRight: "clamp",
  });
  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        height: 3,
        background: "rgba(255,255,255,0.05)",
      }}
    >
      <div
        style={{
          width: `${w}%`,
          height: "100%",
          background: `linear-gradient(90deg, ${GREEN.primary}, ${GREEN.primaryLight})`,
        }}
      />
    </div>
  );
}

// ── Section label ─────────────────────────────────────────
export function SectionLabel({ label }: { label: string }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 12,
        marginBottom: 28,
      }}
    >
      <div
        style={{
          width: 4,
          height: 28,
          borderRadius: 2,
          background: `linear-gradient(180deg, ${GREEN.primaryLight}, ${GREEN.primary})`,
        }}
      />
      <span
        style={{
          color: GREEN.primary,
          fontSize: 16,
          fontFamily: "monospace",
          letterSpacing: 3,
          textTransform: "uppercase",
        }}
      >
        {label}
      </span>
    </div>
  );
}

// ── Fade-out hook ─────────────────────────────────────────
export function useFadeOut(frame: number, durationInFrames: number) {
  return interpolate(frame, [durationInFrames - 15, durationInFrames], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
}

// ── Spring entrance ───────────────────────────────────────
export function useSpringEntrance(frame: number, fps: number, delay = 0) {
  const opacity = interpolate(frame, [delay, delay + 20], [0, 1], {
    extrapolateRight: "clamp",
  });
  const y = interpolate(frame, [delay, delay + 20], [24, 0], {
    extrapolateRight: "clamp",
  });
  const scale = spring({
    frame: frame - delay,
    fps,
    config: { damping: 14, stiffness: 80 },
    from: 0.92,
    to: 1,
  });
  return { opacity, y, scale };
}
