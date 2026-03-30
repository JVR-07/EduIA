import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { PlusCircle, Video, AlertCircle, LayoutGrid } from "lucide-react";
import { Button } from "@/components/ui/button";
import { VideoCard, VideoCardSkeleton } from "@/components/VideoCard";
import { getHistory, type VideoEntry } from "@/lib/api";

export function DashboardPage() {
  const navigate = useNavigate();
  const [videos, setVideos] = useState<VideoEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getHistory()
      .then(setVideos)
      .catch(() =>
        setError(
          "No se pudo conectar al backend. Asegúrate de que FastAPI esté corriendo.",
        ),
      )
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-between px-8 py-5 border-b border-border shrink-0">
        <div>
          <h1 className="text-xl font-bold text-foreground">
            Historial de Videos
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {loading
              ? "Cargando..."
              : `${videos.length} video${videos.length !== 1 ? "s" : ""} generado${videos.length !== 1 ? "s" : ""}`}
          </p>
        </div>
        <Button
          onClick={() => navigate("/videos/new")}
          className="flex items-center gap-2 h-9"
        >
          <PlusCircle className="w-4 h-4" />
          Nuevo Video
        </Button>
      </header>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-8 py-6">
        {/* Error state */}
        {error && (
          <div className="flex items-start gap-3 p-4 rounded-xl border border-destructive/30 bg-destructive/10 text-destructive mb-6">
            <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
            <p className="text-sm">{error}</p>
          </div>
        )}

        {/* Loading skeletons */}
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <VideoCardSkeleton key={i} />
            ))}
          </div>
        )}

        {/* Empty state */}
        {!loading && !error && videos.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-4">
              <Video className="w-7 h-7 text-primary" />
            </div>
            <h2 className="text-lg font-semibold text-foreground mb-2">
              Aún no hay videos
            </h2>
            <p className="text-sm text-muted-foreground max-w-xs mb-6">
              Genera tu primer video educativo con IA. Solo necesitas un tema.
            </p>
            <Button
              onClick={() => navigate("/videos/new")}
              className="flex items-center gap-2"
            >
              <PlusCircle className="w-4 h-4" />
              Crear primer video
            </Button>
          </div>
        )}

        {/* Grid */}
        {!loading && videos.length > 0 && (
          <>
            <div className="flex items-center gap-2 mb-4">
              <LayoutGrid className="w-4 h-4 text-muted-foreground" />
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                Recientes
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {videos.map((v) => (
                <VideoCard key={v.id} entry={v} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
