import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Clock,
  Video,
  BookOpen,
  Layers,
  Monitor,
  Smartphone,
  BarChart2,
  Play,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { type VideoEntry } from "@/lib/api";

// ── Label maps ────────────────────────────────────────────
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
const durationLabels: Record<string, string> = {
  short: "~2 min",
  standard: "~4 min",
  long: "~7 min",
};

interface VideoCardProps {
  entry: VideoEntry;
}

export function VideoCard({ entry }: VideoCardProps) {
  const navigate = useNavigate();
  const { inputs } = entry;
  const isVertical = inputs.orientation === "vertical";
  const date = new Date(entry.created_at).toLocaleDateString("es-MX", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  return (
    <button
      onClick={() => navigate(`/videos/${entry.id}`)}
      className="group w-full text-left rounded-xl border border-border bg-card hover:border-primary/40 hover:bg-card/80 transition-all duration-200 overflow-hidden focus:outline-none focus:ring-2 focus:ring-ring"
    >
      {/* Thumbnail area */}
      <div className="relative bg-gradient-to-br from-muted to-background flex items-center justify-center h-36 overflow-hidden">
        {/* Grid bg */}
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage:
              "linear-gradient(oklch(0.3 0.06 145 / 0.4) 1px, transparent 1px), linear-gradient(90deg, oklch(0.3 0.06 145 / 0.4) 1px, transparent 1px)",
            backgroundSize: "24px 24px",
          }}
        />
        {/* Glow */}
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent" />
        {/* Aspect ratio indicator */}
        <div
          className={`relative z-10 border-2 border-primary/30 rounded flex items-center justify-center bg-primary/5 ${
            isVertical ? "w-14 h-24" : "w-24 h-14"
          }`}
        >
          {isVertical ? (
            <Smartphone className="w-4 h-4 text-primary/60" />
          ) : (
            <Monitor className="w-5 h-5 text-primary/60" />
          )}
        </div>
        {/* Play overlay */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/20">
          <div className="w-10 h-10 rounded-full bg-primary/90 flex items-center justify-center shadow-lg">
            <Play className="w-4 h-4 text-primary-foreground ml-0.5" />
          </div>
        </div>
        {/* Template badge */}
        <span className="absolute top-2 right-2 text-[10px] px-2 py-0.5 rounded-md bg-black/40 text-primary border border-primary/20 backdrop-blur-sm font-medium capitalize">
          {inputs.template}
        </span>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="text-sm font-semibold text-foreground line-clamp-2 leading-snug mb-3 group-hover:text-primary transition-colors">
          {inputs.topic}
        </h3>

        {/* Badges row */}
        <div className="flex flex-wrap gap-1.5 mb-3">
          <Badge
            variant="outline"
            className="text-[10px] px-1.5 py-0 border-primary/20 text-primary"
          >
            {levelLabels[inputs.level] ?? inputs.level}
          </Badge>
          <Badge
            variant="outline"
            className="text-[10px] px-1.5 py-0 border-muted-foreground/20 text-muted-foreground"
          >
            {styleLabels[inputs.style] ?? inputs.style}
          </Badge>
          <Badge
            variant="outline"
            className="text-[10px] px-1.5 py-0 border-muted-foreground/20 text-muted-foreground"
          >
            <BarChart2 className="w-2.5 h-2.5 mr-1" />
            {durationLabels[inputs.duration_hint] ?? inputs.duration_hint}
          </Badge>
        </div>

        {/* Meta */}
        <div className="flex items-center justify-between text-[11px] text-muted-foreground">
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {date}
          </span>
          <span
            className={`flex items-center gap-1 ${entry.status === "completed" ? "text-primary" : "text-muted-foreground"}`}
          >
            <Video className="w-3 h-3" />
            {entry.status === "completed" ? "Completado" : "Procesando"}
          </span>
        </div>
      </div>
    </button>
  );
}

// ── Skeleton card ─────────────────────────────────────────
export function VideoCardSkeleton() {
  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden">
      <Skeleton className="h-36 w-full rounded-none" />
      <div className="p-4 space-y-3">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-1/2" />
        <div className="flex gap-2">
          <Skeleton className="h-5 w-14 rounded-md" />
          <Skeleton className="h-5 w-16 rounded-md" />
        </div>
      </div>
    </div>
  );
}
