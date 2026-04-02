/**
 * PLANTILLA ACADÉMICA
 * Layout dividido: texto izquierda / gráfica derecha.
 * Barra de progreso superior, header de sección, estilo informativo.
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
import {
  GREEN,
  ProgressBar,
  SectionLabel,
  useFadeOut,
  useSpringEntrance,
} from "./common";

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

export interface AcademicTemplateProps {
  script: { title: string; sections?: Record<string, ScriptSection>; scenes?: any[] };
  audioPaths: Record<string, string>;
}

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
      {/* Subtle gradient header band */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 4,
          background: `linear-gradient(90deg, ${GREEN.primary}, ${GREEN.primaryLight}, ${GREEN.primary})`,
        }}
      />
      <ProgressBar frame={frame} durationInFrames={durationInFrames} />
      {children}
    </AbsoluteFill>
  );
}

// ── Intro with centered layout ─────────────────────────────
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
  const h_ = useSpringEntrance(frame, fps, 0);
  const s_ = useSpringEntrance(frame, fps, 30);

  return (
    <SceneWrap durationInFrames={durationInFrames}>
      <div style={{ position: "absolute", inset: 0, display: "flex" }}>
        {/* Left accent strip */}
        <div
          style={{
            width: 8,
            background: `linear-gradient(180deg, ${GREEN.primary}, ${GREEN.primaryLight})`,
            flexShrink: 0,
          }}
        />
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            padding: "60px 80px",
          }}
        >
          {/* Institution-style header */}
          <div
            style={{
              opacity: h_.opacity,
              display: "flex",
              alignItems: "center",
              gap: 12,
              marginBottom: 28,
            }}
          >
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: 8,
                background: GREEN.primaryDim,
                border: `1px solid ${GREEN.border}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 16,
              }}
            >
              📚
            </div>
            <span
              style={{
                color: GREEN.primary,
                fontSize: 13,
                letterSpacing: 2,
                textTransform: "uppercase",
                fontFamily: "monospace",
              }}
            >
              Material de Estudio
            </span>
          </div>
          <h1
            style={{
              transform: `scale(${h_.scale}) translateY(${h_.y}px)`,
              opacity: h_.opacity,
              color: GREEN.text,
              fontSize: 62,
              fontWeight: 800,
              lineHeight: 1.1,
              margin: "0 0 24px",
              maxWidth: 960,
            }}
          >
            {title}
          </h1>
          <p
            style={{
              transform: `translateY(${s_.y}px)`,
              opacity: s_.opacity,
              color: GREEN.muted,
              fontSize: 26,
              fontWeight: 300,
              lineHeight: 1.65,
              maxWidth: 750,
            }}
          >
            {text}
          </p>
        </div>
      </div>
    </SceneWrap>
  );
}

// ── Split layout: text left, visual right ──────────────────
function SplitScene({
  label,
  text,
  rightContent,
  durationInFrames,
}: {
  label: string;
  text: string;
  rightContent?: React.ReactNode;
  durationInFrames: number;
}) {
  const frame = useCurrentFrame();
  const paragraphs = text
    .split(/\n+/)
    .map((p) => p.trim())
    .filter(Boolean)
    .slice(0, 4);
  const rightOp = interpolate(frame, [30, 60], [0, 1], {
    extrapolateRight: "clamp",
  });

  return (
    <SceneWrap durationInFrames={durationInFrames}>
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          padding: "44px 0 44px 0",
          gap: 0,
        }}
      >
        {/* Left: text */}
        <div
          style={{
            flex: 1.1,
            display: "flex",
            flexDirection: "column",
            padding: "0 40px 0 60px",
            borderRight: `1px solid ${GREEN.border}`,
          }}
        >
          <SectionLabel label={label} />
          <div
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              gap: 20,
              overflow: "hidden",
            }}
          >
            {paragraphs.map((p, i) => {
              const delay = i * 18;
              const op = interpolate(frame, [delay, delay + 22], [0, 1], {
                extrapolateRight: "clamp",
                extrapolateLeft: "clamp",
              });
              const x = interpolate(frame, [delay, delay + 22], [-18, 0], {
                extrapolateRight: "clamp",
                extrapolateLeft: "clamp",
              });
              return (
                <div
                  key={i}
                  style={{
                    opacity: op,
                    transform: `translateX(${x}px)`,
                    padding: "12px 16px",
                    borderLeft: `3px solid ${GREEN.primary}`,
                    background: i % 2 === 0 ? GREEN.primaryDim : "transparent",
                    borderRadius: "0 8px 8px 0",
                  }}
                >
                  <p
                    style={{
                      color: GREEN.text,
                      fontSize: 22,
                      fontWeight: 300,
                      lineHeight: 1.6,
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
        {/* Right: visual */}
        {rightContent && (
          <div
            style={{
              flex: 0.9,
              display: "flex",
              flexDirection: "column",
              padding: "0 50px 0 40px",
              opacity: rightOp,
            }}
          >
            {rightContent}
          </div>
        )}
      </div>
    </SceneWrap>
  );
}

function ChartPanel({ chart }: { chart: ChartData }) {
  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
      <p
        style={{
          color: GREEN.muted,
          fontSize: 14,
          marginBottom: 16,
          textAlign: "center",
        }}
      >
        {chart.title}
      </p>
      <ResponsiveContainer width="100%" height="100%">
        {chart.type === "bar" ? (
          <BarChart data={chart.data}>
            <CartesianGrid stroke={GREEN.border} strokeDasharray="4 4" />
            <XAxis
              dataKey="name"
              stroke={GREEN.muted}
              tick={{ fill: GREEN.muted, fontSize: 11 }}
            />
            <YAxis
              stroke={GREEN.muted}
              tick={{ fill: GREEN.muted, fontSize: 11 }}
            />
            <Tooltip
              contentStyle={{
                background: GREEN.bg,
                border: `1px solid ${GREEN.border}`,
                color: GREEN.text,
                fontSize: 13,
              }}
            />
            <Bar dataKey="value" fill={GREEN.primary} radius={[4, 4, 0, 0]} />
          </BarChart>
        ) : (
          <LineChart data={chart.data}>
            <CartesianGrid stroke={GREEN.border} strokeDasharray="4 4" />
            <XAxis
              dataKey="name"
              stroke={GREEN.muted}
              tick={{ fill: GREEN.muted, fontSize: 11 }}
            />
            <YAxis
              stroke={GREEN.muted}
              tick={{ fill: GREEN.muted, fontSize: 11 }}
            />
            <Tooltip
              contentStyle={{
                background: GREEN.bg,
                border: `1px solid ${GREEN.border}`,
                color: GREEN.text,
                fontSize: 13,
              }}
            />
            <Line
              type="monotone"
              dataKey="value"
              stroke={GREEN.primaryLight}
              strokeWidth={2.5}
              dot={{ fill: GREEN.primary, r: 4 }}
            />
          </LineChart>
        )}
      </ResponsiveContainer>
    </div>
  );
}

function Conclusion({
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
          justifyContent: "center",
          padding: "50px 100px",
          opacity: op,
        }}
      >
        <SectionLabel label="Conclusión" />
        <div
          style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}
        >
          {points.map((pt, i) => (
            <div
              key={i}
              style={{
                padding: "18px 20px",
                background: GREEN.primaryDim,
                borderRadius: 12,
                border: `1px solid ${GREEN.border}`,
              }}
            >
              <div
                style={{
                  color: GREEN.primaryLight,
                  fontFamily: "monospace",
                  fontSize: 13,
                  marginBottom: 8,
                }}
              >
                #{String(i + 1).padStart(2, "0")}
              </div>
              <p
                style={{
                  color: GREEN.text,
                  fontSize: 20,
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

export const AcademicTemplate: React.FC<AcademicTemplateProps> = ({
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
             Node = <SplitScene label={scene.type === "question" ? "Pregunta" : "Concepto"} text={scene.text || scene.spoken_text || ""} durationInFrames={durationFrames} />;
          } else if (scene.type === "chart") {
             const chartData = { type: scene.chart_type || "bar", title: scene.title || "Gráfica", data: scene.data || [] };
             Node = <SplitScene label={scene.title || "Datos"} text={scene.text || scene.spoken_text || ""} rightContent={<ChartPanel chart={chartData as any} />} durationInFrames={durationFrames} />;
          } else if (scene.type === "bullets") {
             const pts = scene.items ? scene.items.join(". ") : (scene.text || "");
             Node = <Conclusion text={pts} durationInFrames={durationFrames} />;
          } else if (scene.type === "code") {
             Node = <SplitScene label="Código Fuente" text={scene.spoken_text || ""} rightContent={<pre style={{ background: "#22c55e20", padding: "20px", borderRadius: "8px", color: "#f0fdf4", overflow: "hidden", fontSize: "16px" }}>{scene.code}</pre>} durationInFrames={durationFrames} />;
          } else {
             Node = <SplitScene label="Explicación" text={scene.text || scene.spoken_text || ""} durationInFrames={durationFrames} />;
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

  // Fallback
  const s = script.sections as Record<string, ScriptSection>;
  const frames = {
    i: (s?.introduccion?.duration ?? 10) * fps,
    e: (s?.explicacion?.duration ?? 20) * fps,
    x: (s?.ejemplo?.duration ?? 20) * fps,
    c: (s?.conclusion?.duration ?? 8) * fps,
  };
  const chart = s?.ejemplo?.charts?.[0];

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
        <SplitScene
          label="Explicación"
          text={s?.explicacion?.text ?? ""}
          durationInFrames={frames.e}
        />
      </Sequence>
      <Sequence from={frames.i + frames.e} durationInFrames={frames.x}>
        {audioPaths.ejemplo && <Audio src={audioPaths.ejemplo} />}
        <SplitScene
          label="Ejemplo"
          text={s?.ejemplo?.text ?? ""}
          rightContent={chart ? <ChartPanel chart={chart} /> : undefined}
          durationInFrames={frames.x}
        />
      </Sequence>
      <Sequence
        from={frames.i + frames.e + frames.x}
        durationInFrames={frames.c}
      >
        {audioPaths.conclusion && <Audio src={audioPaths.conclusion} />}
        <Conclusion
          text={s?.conclusion?.text ?? ""}
          durationInFrames={frames.c}
        />
      </Sequence>
    </AbsoluteFill>
  );
};
