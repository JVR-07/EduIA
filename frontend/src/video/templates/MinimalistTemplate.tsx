/**
 * PLANTILLA MINIMALISTA
 * Fondo oscuro verde, tipografía grande, animaciones suaves, sin distractores.
 * Ideal para explicar conceptos claros.
 */
import React from "react";
import {
  AbsoluteFill,
  Audio,
  Sequence,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { GREEN, AnimatedBg, useFadeOut, useSpringEntrance } from "./common";

interface ScriptSection {
  text: string;
  duration: number;
  charts?: ChartData[];
}
interface ChartData {
  type: "bar" | "line";
  title: string;
  data: { name: string; value: number }[];
}

export interface MinimalistTemplateProps {
  script: { title: string; sections?: Record<string, ScriptSection>; scenes?: any[] };
  audioPaths: Record<string, string>;
}

// ── Shared scene wrapper ───────────────────────────────────
function SceneWrap({
  children,
  durationInFrames,
}: {
  children: React.ReactNode;
  durationInFrames: number;
}) {
  const frame = useCurrentFrame();
  const fade = useFadeOut(frame, durationInFrames);
  return (
    <AbsoluteFill
      style={{
        backgroundColor: GREEN.bg,
        opacity: fade,
        fontFamily: "'Inter','Helvetica Neue',sans-serif",
      }}
    >
      <AnimatedBg frame={frame} showGrid particleCount={20} />
      {children}
    </AbsoluteFill>
  );
}

// ── Intro ─────────────────────────────────────────────────
function Intro({
  title,
  text,
  durationInFrames,
}: {
  title: string;
  text: string;
  durationInFrames: number;
}) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const title_ = useSpringEntrance(frame, fps, 0);
  const sub_ = useSpringEntrance(frame, fps, 25);
  const lineW = interpolate(frame, [15, 50], [0, 220], {
    extrapolateRight: "clamp",
  });

  return (
    <SceneWrap durationInFrames={durationInFrames}>
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "40px 80px",
        }}
      >
        {/* Badge */}
        <div
          style={{
            opacity: title_.opacity,
            marginBottom: 20,
            padding: "5px 18px",
            borderRadius: 20,
            border: `1px solid ${GREEN.border}`,
            color: GREEN.primary,
            fontSize: 13,
            letterSpacing: 3,
            textTransform: "uppercase",
          }}
        >
          Educación
        </div>
        {/* Title */}
        <div
          style={{
            transform: `scale(${title_.scale}) translateY(${title_.y}px)`,
            opacity: title_.opacity,
            color: GREEN.text,
            fontSize: 68,
            fontWeight: 800,
            textAlign: "center",
            maxWidth: 900,
            lineHeight: 1.1,
            background: `linear-gradient(135deg, ${GREEN.text} 50%, ${GREEN.primaryLight} 100%)`,
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          {title}
        </div>
        {/* Accent line */}
        <div
          style={{
            width: lineW,
            height: 2,
            background: `linear-gradient(90deg, transparent, ${GREEN.primaryLight}, transparent)`,
            margin: "24px 0",
          }}
        />
        {/* Subtitle */}
        <div
          style={{
            transform: `translateY(${sub_.y}px)`,
            opacity: sub_.opacity,
            color: GREEN.muted,
            fontSize: 24,
            fontWeight: 300,
            textAlign: "center",
            maxWidth: 700,
            lineHeight: 1.6,
          }}
        >
          {text}
        </div>
      </div>
    </SceneWrap>
  );
}

// ── Text scene ─────────────────────────────────────────────
function TextScene({
  label,
  text,
  durationInFrames,
}: {
  label: string;
  text: string;
  durationInFrames: number;
}) {
  const frame = useCurrentFrame();
  const paragraphs = text
    .split(/\n+/)
    .map((p) => p.trim())
    .filter(Boolean)
    .slice(0, 5);

  return (
    <SceneWrap durationInFrames={durationInFrames}>
      {/* Progress line */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          height: 2,
          width: `${interpolate(frame, [0, durationInFrames], [0, 100], { extrapolateRight: "clamp" })}%`,
          background: `linear-gradient(90deg, ${GREEN.primary}, ${GREEN.primaryLight})`,
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          padding: "60px 100px",
        }}
      >
        <div
          style={{
            color: GREEN.primary,
            fontSize: 14,
            letterSpacing: 3,
            textTransform: "uppercase",
            marginBottom: 36,
          }}
        >
          {label}
        </div>
        <div
          style={{ flex: 1, display: "flex", flexDirection: "column", gap: 24 }}
        >
          {paragraphs.map((p, i) => {
            const delay = i * 20;
            const op = interpolate(frame, [delay, delay + 22], [0, 1], {
              extrapolateRight: "clamp",
              extrapolateLeft: "clamp",
            });
            const x = interpolate(frame, [delay, delay + 22], [-20, 0], {
              extrapolateRight: "clamp",
              extrapolateLeft: "clamp",
            });
            return (
              <div
                key={i}
                style={{
                  opacity: op,
                  transform: `translateX(${x}px)`,
                  display: "flex",
                  gap: 16,
                  alignItems: "flex-start",
                }}
              >
                <div
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: "50%",
                    background: GREEN.primary,
                    boxShadow: `0 0 6px ${GREEN.primary}`,
                    flexShrink: 0,
                    marginTop: 12,
                  }}
                />
                <p
                  style={{
                    color: GREEN.text,
                    fontSize: 28,
                    fontWeight: 300,
                    lineHeight: 1.65,
                    margin: 0,
                  }}
                >
                  {p}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </SceneWrap>
  );
}

// ── Example with chart ─────────────────────────────────────
function ExampleScene({
  text,
  charts,
  durationInFrames,
}: {
  text: string;
  charts: ChartData[];
  durationInFrames: number;
}) {
  const frame = useCurrentFrame();
  const chart = charts[0];
  const chartOp = interpolate(frame, [20, 50], [0, 1], {
    extrapolateRight: "clamp",
  });

  return (
    <SceneWrap durationInFrames={durationInFrames}>
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          padding: "50px 80px",
        }}
      >
        <div
          style={{
            color: GREEN.primary,
            fontSize: 14,
            letterSpacing: 3,
            textTransform: "uppercase",
            marginBottom: 24,
          }}
        >
          Ejemplo
        </div>
        <p
          style={{
            color: GREEN.text,
            fontSize: 26,
            fontWeight: 300,
            lineHeight: 1.6,
            margin: "0 0 32px",
          }}
        >
          {text}
        </p>
        {chart && (
          <div style={{ flex: 1, opacity: chartOp }}>
            <p
              style={{
                color: GREEN.muted,
                fontSize: 14,
                marginBottom: 12,
                textAlign: "center",
              }}
            >
              {chart.title}
            </p>
            <ResponsiveContainer width="100%" height="80%">
              {chart.type === "bar" ? (
                <BarChart data={chart.data}>
                  <CartesianGrid stroke={GREEN.border} strokeDasharray="3 3" />
                  <XAxis
                    dataKey="name"
                    stroke={GREEN.muted}
                    tick={{ fill: GREEN.muted, fontSize: 12 }}
                  />
                  <YAxis
                    stroke={GREEN.muted}
                    tick={{ fill: GREEN.muted, fontSize: 12 }}
                  />
                  <Tooltip
                    contentStyle={{
                      background: GREEN.surface,
                      border: `1px solid ${GREEN.border}`,
                      color: GREEN.text,
                    }}
                  />
                  <Bar
                    dataKey="value"
                    fill={GREEN.primary}
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              ) : (
                <LineChart data={chart.data}>
                  <CartesianGrid stroke={GREEN.border} strokeDasharray="3 3" />
                  <XAxis
                    dataKey="name"
                    stroke={GREEN.muted}
                    tick={{ fill: GREEN.muted, fontSize: 12 }}
                  />
                  <YAxis
                    stroke={GREEN.muted}
                    tick={{ fill: GREEN.muted, fontSize: 12 }}
                  />
                  <Tooltip
                    contentStyle={{
                      background: GREEN.surface,
                      border: `1px solid ${GREEN.border}`,
                      color: GREEN.text,
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke={GREEN.primaryLight}
                    strokeWidth={2}
                    dot={{ fill: GREEN.primary }}
                  />
                </LineChart>
              )}
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </SceneWrap>
  );
}

// ── Conclusion ─────────────────────────────────────────────
function ConclusionScene({
  text,
  durationInFrames,
}: {
  text: string;
  durationInFrames: number;
}) {
  const frame = useCurrentFrame();
  const points = text
    .split(/[.。]\s+/)
    .filter(Boolean)
    .slice(0, 4);
  const op = interpolate(frame, [0, 20], [0, 1], { extrapolateRight: "clamp" });

  return (
    <SceneWrap durationInFrames={durationInFrames}>
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "60px 100px",
          opacity: op,
        }}
      >
        <div
          style={{
            color: GREEN.primary,
            fontSize: 14,
            letterSpacing: 3,
            textTransform: "uppercase",
            marginBottom: 32,
          }}
        >
          Conclusión
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 16,
            width: "100%",
            maxWidth: 820,
          }}
        >
          {points.map((pt, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: 16,
                padding: "14px 20px",
                borderRadius: 12,
                background: GREEN.primaryDim,
                border: `1px solid ${GREEN.border}`,
              }}
            >
              <span
                style={{
                  color: GREEN.primaryLight,
                  fontWeight: 700,
                  fontSize: 18,
                  lineHeight: 1,
                }}
              >
                {i + 1}
              </span>
              <p
                style={{
                  color: GREEN.text,
                  fontSize: 22,
                  fontWeight: 300,
                  lineHeight: 1.55,
                  margin: 0,
                }}
              >
                {pt}.
              </p>
            </div>
          ))}
        </div>
      </div>
    </SceneWrap>
  );
}

// ── Root composition ───────────────────────────────────────
export const MinimalistTemplate: React.FC<MinimalistTemplateProps> = ({
  script,
  audioPaths,
}) => {
  const { fps } = useVideoConfig();

  if (script.scenes) {
    let currentStart = 0;
    return (
      <AbsoluteFill>
        {script.scenes.map((scene, i) => {
          const durationFrames = Math.round((scene.duration || 10) * fps);
          const start = Math.round(currentStart);
          currentStart += durationFrames;
          const audioSrc = audioPaths[scene.id || `scene_${i}`];
          
          let Node;
          if (scene.type === "title" || scene.type === "quote" || scene.type === "outro") {
             Node = <Intro title={scene.text || (scene.type === "outro" ? "Gracias por ver" : "...")} text={scene.type === "quote" ? (scene.author || "") : (scene.type === "outro" ? (scene.spoken_text || "") : (scene.spoken_text || ""))} durationInFrames={durationFrames} />;
          } else if (scene.type === "concept" || scene.type === "question") {
             Node = <TextScene label={scene.type === "question" ? "Pregunta" : "Concepto"} text={scene.text || scene.spoken_text || ""} durationInFrames={durationFrames} />;
          } else if (scene.type === "chart") {
             const chartData = { type: scene.chart_type || "bar", title: scene.title || "Gráfica", data: scene.data || [] };
             Node = <ExampleScene text={scene.text || scene.spoken_text || ""} charts={[chartData as any]} durationInFrames={durationFrames} />;
          } else if (scene.type === "bullets") {
             const pts = scene.items ? scene.items.join(". ") : (scene.text || "");
             Node = <ConclusionScene text={pts} durationInFrames={durationFrames} />;
          } else if (scene.type === "code") {
             Node = <TextScene label="Código Fuente" text={`${scene.spoken_text || ""}\n\n${scene.code}`} durationInFrames={durationFrames} />;
          } else {
             Node = <TextScene label="Explicación" text={scene.text || scene.spoken_text || ""} durationInFrames={durationFrames} />;
          }

          return (
            <Sequence key={scene.id || i} from={start} durationInFrames={durationFrames}>
              {audioSrc && <Audio src={audioSrc} />}
              {Node}
            </Sequence>
          );
        })}
      </AbsoluteFill>
    );
  }

  const s = script.sections as Record<string, ScriptSection>;
  const frames = {
    i: (s?.introduccion?.duration ?? 10) * fps,
    e: (s?.explicacion?.duration ?? 20) * fps,
    x: (s?.ejemplo?.duration ?? 20) * fps,
    c: (s?.conclusion?.duration ?? 8) * fps,
  };

  return (
    <AbsoluteFill>
      <Sequence from={0} durationInFrames={frames.i}>
        {audioPaths.introduccion && <Audio src={audioPaths.introduccion} />}
        <Intro
          title={script.title}
          text={s?.introduccion?.text ?? ""}
          durationInFrames={frames.i}
        />
      </Sequence>
      <Sequence from={frames.i} durationInFrames={frames.e}>
        {audioPaths.explicacion && <Audio src={audioPaths.explicacion} />}
        <TextScene
          label="Explicación"
          text={s?.explicacion?.text ?? ""}
          durationInFrames={frames.e}
        />
      </Sequence>
      <Sequence from={frames.i + frames.e} durationInFrames={frames.x}>
        {audioPaths.ejemplo && <Audio src={audioPaths.ejemplo} />}
        <ExampleScene
          text={s?.ejemplo?.text ?? ""}
          charts={s?.ejemplo?.charts ?? []}
          durationInFrames={frames.x}
        />
      </Sequence>
      <Sequence
        from={frames.i + frames.e + frames.x}
        durationInFrames={frames.c}
      >
        {audioPaths.conclusion && <Audio src={audioPaths.conclusion} />}
        <ConclusionScene
          text={s?.conclusion?.text ?? ""}
          durationInFrames={frames.c}
        />
      </Sequence>
    </AbsoluteFill>
  );
};
