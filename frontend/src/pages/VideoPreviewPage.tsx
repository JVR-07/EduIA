import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Monitor,
  Smartphone,
  Clock,
  Layers,
  BookOpen,
  Globe,
  Users,
  FileText,
  AlertCircle,
  Download,
} from "lucide-react";
import { Player } from "@remotion/player";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { getVideo, type VideoEntry } from "@/lib/api";
import { VideoComposition } from "@/video/VideoComposition";

// ── Label maps ─────────────────────────────────────────────
const levelLabels: Record<string, string> = {
  basic: "Básico",
  intermediate: "Intermedio",
  advanced: "Avanzado",
};
const styleLabels: Record<string, string> = {
  explanatory: "Explicativo",
  narrative: "Narrativo",
  tutorial: "Tutorial",
};
const langLabels: Record<string, string> = { es: "Español", en: "English" };
const durationLabels: Record<string, string> = {
  short: "~2 min",
  standard: "~4 min",
  long: "~7 min",
};
const templateLabels: Record<string, string> = {
  minimalist: "Minimalista",
  academic: "Académico",
  impact: "Impacto Visual",
};

function InfoRow({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="w-7 h-7 rounded-md bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
        <Icon className="w-3.5 h-3.5 text-primary" />
      </div>
      <div>
        <p className="text-[11px] text-muted-foreground mb-0.5">{label}</p>
        <p className="text-sm text-foreground font-medium">{value}</p>
      </div>
    </div>
  );
}

export function VideoPreviewPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [entry, setEntry] = useState<VideoEntry | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    getVideo(id)
      .then(setEntry)
      .catch(() =>
        setError(
          "No se encontró el video. Es posible que el backend no esté corriendo.",
        ),
      )
      .finally(() => setLoading(false));
  }, [id]);

  const isVertical = entry?.inputs.orientation === "vertical";
  const compositionW = isVertical ? 720 : 1280;
  const compositionH = isVertical ? 1280 : 720;

  // Calculate total duration from script
  const totalFrames = React.useMemo(() => {
    if (!entry?.script) return 600;
    const s = entry.script as Record<string, { duration?: number }>;
    const secs = [
      "introduccion",
      "explicacion",
      "ejemplo",
      "conclusion",
    ].reduce((acc, k) => acc + (s[k]?.duration ?? 10), 0);
    return secs * 30;
  }, [entry]);

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <header className="flex items-center gap-4 px-8 py-5 border-b border-border shrink-0">
        <button
          onClick={() => navigate("/")}
          className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div className="flex-1 min-w-0">
          {loading ? (
            <Skeleton className="h-5 w-52" />
          ) : (
            <h1 className="text-lg font-bold text-foreground truncate">
              {entry?.inputs.topic ?? "Video"}
            </h1>
          )}
          {!loading && entry && (
            <div className="flex items-center gap-2 mt-1">
              <Badge
                variant="outline"
                className="text-[10px] border-primary/20 text-primary"
              >
                {entry.status === "completed" ? "Completado" : "Procesando"}
              </Badge>
              <span className="text-xs text-muted-foreground">
                {new Date(entry.created_at).toLocaleDateString("es-MX", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                })}
              </span>
            </div>
          )}
        </div>
        {entry?.video_path && (
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-2 h-8 text-xs"
          >
            <Download className="w-3.5 h-3.5" />
            Descargar MP4
          </Button>
        )}
      </header>

      {/* Main layout */}
      <div className="flex-1 overflow-hidden flex">
        {/* Player area */}
        <div className="flex-1 overflow-y-auto flex flex-col items-center justify-start p-8 bg-[oklch(0.07_0.015_145)]">
          {error && (
            <div className="flex items-start gap-3 p-4 rounded-xl border border-destructive/30 bg-destructive/10 text-destructive max-w-lg">
              <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
              <p className="text-sm">{error}</p>
            </div>
          )}

          {loading && (
            <div className="w-full max-w-3xl aspect-video rounded-xl overflow-hidden">
              <Skeleton className="w-full h-full rounded-xl" />
            </div>
          )}

          {!loading && entry && (
            <>
              {/* Orientation hint */}
              <div className="flex items-center gap-2 mb-4 text-xs text-muted-foreground">
                {isVertical ? (
                  <>
                    <Smartphone className="w-3.5 h-3.5" /> Vertical (9:16)
                  </>
                ) : (
                  <>
                    <Monitor className="w-3.5 h-3.5" /> Horizontal (16:9)
                  </>
                )}
                <span className="text-border">·</span>
                <span className="capitalize">
                  {templateLabels[entry.inputs.template] ??
                    entry.inputs.template}
                </span>
              </div>

              {/* Remotion Player – rendered from JSON, no MP4 needed */}
              <div
                className="rounded-xl overflow-hidden shadow-2xl border border-border w-full"
                style={{ maxWidth: isVertical ? 360 : 800 }}
              >
                <Player
                  component={VideoComposition}
                  inputProps={{
                    script: {
                      title: entry.inputs.topic,
                      sections: entry.script as Parameters<
                        typeof VideoComposition
                      >[0]["script"]["sections"],
                    },
                    audioPaths: entry.audio_files ?? {},
                    templateId: entry.inputs.template,
                    orientation: entry.inputs.orientation,
                  }}
                  durationInFrames={totalFrames}
                  compositionWidth={compositionW}
                  compositionHeight={compositionH}
                  fps={30}
                  style={{ width: "100%" }}
                  controls
                  autoPlay={false}
                />
              </div>
            </>
          )}
        </div>

        {/* Side panel — inputs */}
        <aside className="w-72 shrink-0 border-l border-border overflow-y-auto bg-card">
          <div className="p-5">
            <h2 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-5">
              Parámetros usados
            </h2>

            {loading && (
              <div className="space-y-4">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="flex gap-3">
                    <Skeleton className="w-7 h-7 rounded-md shrink-0" />
                    <div className="space-y-1.5 flex-1">
                      <Skeleton className="h-2.5 w-16" />
                      <Skeleton className="h-3.5 w-24" />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {!loading && entry && (
              <div className="space-y-5">
                <InfoRow
                  icon={FileText}
                  label="Tema"
                  value={entry.inputs.topic}
                />
                <InfoRow
                  icon={Globe}
                  label="Idioma"
                  value={
                    langLabels[entry.inputs.language] ?? entry.inputs.language
                  }
                />
                <InfoRow
                  icon={BookOpen}
                  label="Nivel"
                  value={levelLabels[entry.inputs.level] ?? entry.inputs.level}
                />
                <InfoRow
                  icon={Layers}
                  label="Estilo"
                  value={styleLabels[entry.inputs.style] ?? entry.inputs.style}
                />
                <InfoRow
                  icon={Clock}
                  label="Duración"
                  value={
                    durationLabels[entry.inputs.duration_hint] ??
                    entry.inputs.duration_hint
                  }
                />
                <InfoRow
                  icon={
                    entry.inputs.orientation === "vertical"
                      ? Smartphone
                      : Monitor
                  }
                  label="Orientación"
                  value={
                    entry.inputs.orientation === "vertical"
                      ? "Vertical (9:16)"
                      : "Horizontal (16:9)"
                  }
                />
                <InfoRow
                  icon={Layers}
                  label="Plantilla"
                  value={
                    templateLabels[entry.inputs.template] ??
                    entry.inputs.template
                  }
                />

                {entry.inputs.target_audience && (
                  <>
                    <Separator />
                    <InfoRow
                      icon={Users}
                      label="Audiencia"
                      value={entry.inputs.target_audience}
                    />
                  </>
                )}

                {entry.inputs.extra_notes && (
                  <>
                    <Separator />
                    <div className="rounded-lg bg-muted p-3">
                      <p className="text-[11px] text-muted-foreground mb-1">
                        Notas adicionales
                      </p>
                      <p className="text-xs text-foreground leading-relaxed">
                        {entry.inputs.extra_notes}
                      </p>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}
