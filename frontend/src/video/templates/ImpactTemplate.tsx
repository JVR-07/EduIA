/**
 * PLANTILLA IMPACTO VISUAL
 * Fondo con partículas animadas y gradientes de profundidad.
 * Texto con typewriter effect para la intro. Energético y dinámico.
 */
import React from "react"
import { AbsoluteFill, Audio, Sequence, interpolate, useCurrentFrame, useVideoConfig } from "remotion"
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts"
import { GREEN, AnimatedBg, useFadeOut } from "./common"

interface ScriptSection { text: string; duration: number; charts?: ChartData[] }
interface ChartData { type: "bar" | "line"; title: string; data: { name: string; value: number }[] }

export interface ImpactTemplateProps {
  script: { title: string; sections: Record<string, ScriptSection> }
  audioPaths: Record<string, string>
}

function SceneWrap({ children, durationInFrames }: { children: React.ReactNode; durationInFrames: number }) {
  const frame = useCurrentFrame()
  const fade = useFadeOut(frame, durationInFrames)
  return (
    <AbsoluteFill style={{ backgroundColor: GREEN.bg, opacity: fade, fontFamily: "'Inter','Helvetica Neue',sans-serif" }}>
      {/* Rich particle background */}
      <AnimatedBg frame={frame} showGrid showParticles particleCount={50} />
      {/* Radial overlay for depth */}
      <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 70% 60% at 50% 50%, transparent, rgba(0,0,0,0.45))" }} />
      {children}
    </AbsoluteFill>
  )
}

// ── Typewriter hook ────────────────────────────────────────
function useTypewriter(text: string, frame: number, startFrame = 10, charsPerFrame = 2) {
  const visible = Math.max(0, (frame - startFrame) * charsPerFrame)
  return text.slice(0, visible)
}

// ── Intro — dramatic reveal ────────────────────────────────
function Intro({ title, text, durationInFrames }: { title: string; text: string; durationInFrames: number }) {
  const frame = useCurrentFrame()
  const typed = useTypewriter(title, frame, 5, 3)
  const subOp = interpolate(frame, [45, 70], [0, 1], { extrapolateRight: "clamp" })
  const subY = interpolate(frame, [45, 70], [20, 0], { extrapolateRight: "clamp" })
  const glowPulse = 0.5 + 0.5 * Math.sin(frame / 20)

  return (
    <SceneWrap durationInFrames={durationInFrames}>
      <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "40px 80px" }}>
        {/* Title typewriter */}
        <div style={{
          fontSize: 74, fontWeight: 900, color: GREEN.text, textAlign: "center",
          lineHeight: 1.1, maxWidth: 1000,
          textShadow: `0 0 ${20 + glowPulse * 15}px ${GREEN.primary}40, 0 0 40px ${GREEN.primary}20`,
        }}>
          {typed}
          {/* Blinking cursor */}
          {frame > 5 && typed.length < title.length && (
            <span style={{ color: GREEN.primary, opacity: Math.sin(frame / 4) > 0 ? 1 : 0 }}>|</span>
          )}
        </div>

        {/* Glowing underline */}
        <div style={{
          marginTop: 20, height: 3, width: interpolate(frame, [10, 60], [0, 360], { extrapolateRight: "clamp" }),
          background: `linear-gradient(90deg, transparent, ${GREEN.primaryLight}, transparent)`,
          boxShadow: `0 0 12px ${GREEN.primary}`,
        }} />

        {/* Subtitle */}
        <p style={{ transform: `translateY(${subY}px)`, opacity: subOp, marginTop: 28, color: GREEN.muted, fontSize: 26, fontWeight: 300, textAlign: "center", maxWidth: 720, lineHeight: 1.65 }}>
          {text}
        </p>
      </div>
    </SceneWrap>
  )
}

// ── Text scene — staggered glowing bullets ─────────────────
function TextScene({ label, text, durationInFrames }: { label: string; text: string; durationInFrames: number }) {
  const frame = useCurrentFrame()
  const paragraphs = text.split(/\n+/).map(p => p.trim()).filter(Boolean).slice(0, 5)
  const labelOp = interpolate(frame, [0, 20], [0, 1], { extrapolateRight: "clamp" })

  return (
    <SceneWrap durationInFrames={durationInFrames}>
      <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", padding: "56px 90px" }}>
        {/* Section badge */}
        <div style={{ opacity: labelOp, display: "inline-flex", alignItems: "center", gap: 10, marginBottom: 32 }}>
          <div style={{ width: 8, height: 8, borderRadius: "50%", background: GREEN.primary, boxShadow: `0 0 10px ${GREEN.primary}` }} />
          <span style={{ color: GREEN.primaryLight, fontSize: 15, fontFamily: "monospace", letterSpacing: 3, textTransform: "uppercase" }}>{label}</span>
        </div>

        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 22 }}>
          {paragraphs.map((p, i) => {
            const delay = i * 20
            const op = interpolate(frame, [delay, delay + 25], [0, 1], { extrapolateRight: "clamp", extrapolateLeft: "clamp" })
            const y = interpolate(frame, [delay, delay + 25], [22, 0], { extrapolateRight: "clamp", extrapolateLeft: "clamp" })
            const glowing = i === Math.floor(frame / 40) % paragraphs.length
            return (
              <div key={i} style={{
                opacity: op, transform: `translateY(${y}px)`,
                display: "flex", gap: 16, alignItems: "flex-start",
                padding: "12px 18px", borderRadius: 12,
                background: glowing ? `linear-gradient(90deg, ${GREEN.primaryDim}, transparent)` : "transparent",
                transition: "background 0.3s ease",
                border: `1px solid ${glowing ? GREEN.border : "transparent"}`,
              }}>
                <div style={{ marginTop: 10, width: 8, height: 8, borderRadius: "50%", background: GREEN.primary, boxShadow: glowing ? `0 0 10px ${GREEN.primary}` : "none", flexShrink: 0 }} />
                <p style={{ color: GREEN.text, fontSize: 27, fontWeight: 300, lineHeight: 1.65, margin: 0 }}>{p}</p>
              </div>
            )
          })}
        </div>
      </div>
    </SceneWrap>
  )
}

// ── Example with dramatic chart ───────────────────────────
function ExampleScene({ text, charts, durationInFrames }: { text: string; charts: ChartData[]; durationInFrames: number }) {
  const frame = useCurrentFrame()
  const chart = charts[0]
  const chartOp = interpolate(frame, [15, 50], [0, 1], { extrapolateRight: "clamp" })
  const textOp = interpolate(frame, [0, 20], [0, 1], { extrapolateRight: "clamp" })

  return (
    <SceneWrap durationInFrames={durationInFrames}>
      <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", padding: "44px 80px" }}>
        <div style={{ opacity: textOp, marginBottom: 20 }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: GREEN.primaryLight, boxShadow: `0 0 8px ${GREEN.primaryLight}` }} />
            <span style={{ color: GREEN.primaryLight, fontSize: 15, fontFamily: "monospace", letterSpacing: 3, textTransform: "uppercase" }}>Ejemplo</span>
          </div>
          <p style={{ color: GREEN.text, fontSize: 24, fontWeight: 300, lineHeight: 1.6, margin: 0 }}>{text}</p>
        </div>

        {chart && (
          <div style={{ flex: 1, opacity: chartOp, padding: "16px", background: "rgba(0,0,0,0.3)", borderRadius: 16, border: `1px solid ${GREEN.border}` }}>
            <p style={{ color: GREEN.muted, fontSize: 13, textAlign: "center", marginBottom: 12 }}>{chart.title}</p>
            <ResponsiveContainer width="100%" height="85%">
              {chart.type === "bar" ? (
                <BarChart data={chart.data}>
                  <XAxis dataKey="name" stroke={GREEN.muted} tick={{ fill: GREEN.muted, fontSize: 12 }} />
                  <YAxis stroke={GREEN.muted} tick={{ fill: GREEN.muted, fontSize: 12 }} />
                  <Tooltip contentStyle={{ background: GREEN.bg, border: `1px solid ${GREEN.border}`, color: GREEN.text }} />
                  <Bar dataKey="value" fill={GREEN.primary} radius={[4, 4, 0, 0]} />
                </BarChart>
              ) : (
                <LineChart data={chart.data}>
                  <XAxis dataKey="name" stroke={GREEN.muted} tick={{ fill: GREEN.muted, fontSize: 12 }} />
                  <YAxis stroke={GREEN.muted} tick={{ fill: GREEN.muted, fontSize: 12 }} />
                  <Tooltip contentStyle={{ background: GREEN.bg, border: `1px solid ${GREEN.border}`, color: GREEN.text }} />
                  <Line type="monotone" dataKey="value" stroke={GREEN.primaryLight} strokeWidth={2.5} dot={{ fill: GREEN.primary, r: 5 }} />
                </LineChart>
              )}
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </SceneWrap>
  )
}

// ── Conclusion — impactful numbered reveal ────────────────
function Conclusion({ text, durationInFrames }: { text: string; durationInFrames: number }) {
  const frame = useCurrentFrame()
  const points = text.split(/[.。]\s+/).filter(Boolean).slice(0, 4)

  return (
    <SceneWrap durationInFrames={durationInFrames}>
      <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", justifyContent: "center", padding: "50px 100px" }}>
        <div style={{ color: GREEN.primaryLight, fontSize: 15, fontFamily: "monospace", letterSpacing: 3, textTransform: "uppercase", marginBottom: 36 }}>
          Ideas Clave
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {points.map((pt, i) => {
            const delay = i * 20
            const op = interpolate(frame, [delay, delay + 25], [0, 1], { extrapolateRight: "clamp", extrapolateLeft: "clamp" })
            const x = interpolate(frame, [delay, delay + 25], [30, 0], { extrapolateRight: "clamp", extrapolateLeft: "clamp" })
            return (
              <div key={i} style={{ opacity: op, transform: `translateX(${x}px)`, display: "flex", alignItems: "flex-start", gap: 16, padding: "16px 22px", background: `linear-gradient(90deg, ${GREEN.primaryDim}, transparent)`, borderRadius: 12, border: `1px solid ${GREEN.border}`, boxShadow: `0 0 20px ${GREEN.primary}0a` }}>
                <span style={{ fontSize: 32, fontWeight: 900, color: GREEN.primary, lineHeight: 1, filter: `drop-shadow(0 0 8px ${GREEN.primary})`, flexShrink: 0 }}>{i + 1}</span>
                <p style={{ color: GREEN.text, fontSize: 22, fontWeight: 300, lineHeight: 1.55, margin: 0 }}>{pt}.</p>
              </div>
            )
          })}
        </div>
      </div>
    </SceneWrap>
  )
}

// ── Root ──────────────────────────────────────────────────
export const ImpactTemplate: React.FC<ImpactTemplateProps> = ({ script, audioPaths }) => {
  const { fps } = useVideoConfig()
  const s = script.sections as Record<string, ScriptSection>
  const frames = { i: (s.introduccion?.duration ?? 10) * fps, e: (s.explicacion?.duration ?? 20) * fps, x: (s.ejemplo?.duration ?? 20) * fps, c: (s.conclusion?.duration ?? 8) * fps }

  return (
    <AbsoluteFill>
      <Sequence from={0} durationInFrames={frames.i}>
        {audioPaths.introduccion && <Audio src={audioPaths.introduccion} />}
        <Intro title={script.title} text={s.introduccion?.text ?? ""} durationInFrames={frames.i} />
      </Sequence>
      <Sequence from={frames.i} durationInFrames={frames.e}>
        {audioPaths.explicacion && <Audio src={audioPaths.explicacion} />}
        <TextScene label="Explicación" text={s.explicacion?.text ?? ""} durationInFrames={frames.e} />
      </Sequence>
      <Sequence from={frames.i + frames.e} durationInFrames={frames.x}>
        {audioPaths.ejemplo && <Audio src={audioPaths.ejemplo} />}
        <ExampleScene text={s.ejemplo?.text ?? ""} charts={s.ejemplo?.charts ?? []} durationInFrames={frames.x} />
      </Sequence>
      <Sequence from={frames.i + frames.e + frames.x} durationInFrames={frames.c}>
        {audioPaths.conclusion && <Audio src={audioPaths.conclusion} />}
        <Conclusion text={s.conclusion?.text ?? ""} durationInFrames={frames.c} />
      </Sequence>
    </AbsoluteFill>
  )
}
