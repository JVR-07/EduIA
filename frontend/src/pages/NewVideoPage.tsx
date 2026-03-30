import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Video,
  Monitor,
  Smartphone,
  ChevronRight,
  Loader2,
  AlertCircle,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { generateVideo, type VideoInputs } from "@/lib/api";
import { cn } from "@/lib/utils";

const TEMPLATES = [
  { id: "minimalist", label: "Minimalista", desc: "Limpio, tipografía grande" },
  { id: "academic", label: "Académico", desc: "Estructurado con gráficas" },
  { id: "impact", label: "Impacto Visual", desc: "Dinámico con partículas" },
];

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-4">
      {children}
    </h3>
  );
}

export function NewVideoPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState<VideoInputs>({
    topic: "",
    language: "es",
    level: "intermediate",
    style: "explanatory",
    duration_hint: "standard",
    orientation: "horizontal",
    template: "academic",
    target_audience: "",
    extra_notes: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const set = (field: keyof VideoInputs) => (value: string) =>
    setForm((f) => ({ ...f, [field]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.topic.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const result = await generateVideo(form);
      navigate(`/videos/${result.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido");
      setLoading(false);
    }
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-between px-8 py-5 border-b border-border shrink-0">
        <div>
          <h1 className="text-xl font-bold text-foreground">Nuevo Video</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Configura los parámetros y genera con IA
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Sparkles className="w-3.5 h-3.5 text-primary" />
          <span>Powered by Gemini</span>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto">
        <form onSubmit={handleSubmit}>
          <div className="max-w-3xl mx-auto px-8 py-8 space-y-10">
            {/* Error */}
            {error && (
              <div className="flex items-start gap-3 p-4 rounded-xl border border-destructive/30 bg-destructive/10 text-destructive">
                <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                <p className="text-sm">{error}</p>
              </div>
            )}

            {/* ── Tema ── */}
            <section>
              <SectionHeading>Contenido</SectionHeading>
              <div className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="topic">
                    Tema del video <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="topic"
                    placeholder="Ej: Leyes de Kirchhoff en circuitos eléctricos"
                    value={form.topic}
                    onChange={(e) => set("topic")(e.target.value)}
                    className="h-11 text-base"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="target_audience">Audiencia objetivo</Label>
                  <Input
                    id="target_audience"
                    placeholder="Ej: Estudiantes de primer año de ingeniería"
                    value={form.target_audience}
                    onChange={(e) => set("target_audience")(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="extra_notes">
                    Notas adicionales para la IA
                  </Label>
                  <Textarea
                    id="extra_notes"
                    placeholder="Instrucciones adicionales sobre el tono, ejemplos específicos, qué evitar, etc."
                    value={form.extra_notes}
                    onChange={(e) => set("extra_notes")(e.target.value)}
                    className="min-h-[80px] resize-none"
                  />
                </div>
              </div>
            </section>

            <Separator />

            {/* ── Parámetros del guión ── */}
            <section>
              <SectionHeading>Parámetros del guión</SectionHeading>
              <div className="grid grid-cols-2 gap-5">
                <div className="space-y-2">
                  <Label>Idioma</Label>
                  <Select value={form.language} onValueChange={set("language")}>
                    <SelectTrigger id="language">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="es">🇲🇽 Español</SelectItem>
                      <SelectItem value="en">🇺🇸 English</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Nivel</Label>
                  <Select value={form.level} onValueChange={set("level")}>
                    <SelectTrigger id="level">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="basic">Básico</SelectItem>
                      <SelectItem value="intermediate">Intermedio</SelectItem>
                      <SelectItem value="advanced">Avanzado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Estilo narrativo</Label>
                  <Select value={form.style} onValueChange={set("style")}>
                    <SelectTrigger id="style">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="explanatory">Explicativo</SelectItem>
                      <SelectItem value="narrative">Narrativo</SelectItem>
                      <SelectItem value="tutorial">
                        Tutorial paso a paso
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Duración estimada</Label>
                  <Select
                    value={form.duration_hint}
                    onValueChange={set("duration_hint")}
                  >
                    <SelectTrigger id="duration_hint">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="short">Corto (~2 min)</SelectItem>
                      <SelectItem value="standard">
                        Estándar (~4 min)
                      </SelectItem>
                      <SelectItem value="long">Largo (~7 min)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </section>

            <Separator />

            {/* ── Formato visual ── */}
            <section>
              <SectionHeading>Formato Visual</SectionHeading>
              <div className="space-y-6">
                {/* Orientation toggle */}
                <div className="space-y-2">
                  <Label>Orientación</Label>
                  <div className="flex gap-3">
                    {[
                      {
                        value: "horizontal",
                        label: "Horizontal",
                        desc: "16:9",
                        icon: Monitor,
                      },
                      {
                        value: "vertical",
                        label: "Vertical",
                        desc: "9:16",
                        icon: Smartphone,
                      },
                    ].map(({ value, label, desc, icon: Icon }) => (
                      <button
                        key={value}
                        type="button"
                        onClick={() => set("orientation")(value)}
                        className={cn(
                          "flex-1 flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all duration-150 cursor-pointer",
                          form.orientation === value
                            ? "border-primary bg-primary/10 text-primary"
                            : "border-border bg-card text-muted-foreground hover:border-primary/30 hover:text-foreground",
                        )}
                      >
                        <Icon className="w-6 h-6" />
                        <div className="text-center">
                          <p className="text-sm font-medium">{label}</p>
                          <p className="text-xs opacity-70">{desc}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Template cards */}
                <div className="space-y-2">
                  <Label>Plantilla</Label>
                  <div className="grid grid-cols-3 gap-3">
                    {TEMPLATES.map(({ id, label, desc }) => (
                      <button
                        key={id}
                        type="button"
                        onClick={() => set("template")(id)}
                        className={cn(
                          "flex flex-col items-start gap-1.5 p-4 rounded-xl border-2 text-left transition-all duration-150 cursor-pointer",
                          form.template === id
                            ? "border-primary bg-primary/10"
                            : "border-border bg-card hover:border-primary/30",
                        )}
                      >
                        {/* Template preview mini */}
                        <div
                          className={cn(
                            "w-full h-10 rounded-md mb-1 flex items-center justify-center overflow-hidden",
                            id === "minimalist" &&
                              "bg-gradient-to-r from-muted to-muted/50",
                            id === "academic" &&
                              "bg-gradient-to-r from-primary/20 to-muted/50",
                            id === "impact" &&
                              "bg-gradient-to-r from-primary/30 to-accent/20",
                          )}
                        >
                          {id === "minimalist" && (
                            <span className="text-[10px] text-muted-foreground font-mono">
                              Aa
                            </span>
                          )}
                          {id === "academic" && (
                            <div className="flex gap-1">
                              <div className="w-4 h-5 bg-primary/30 rounded-sm" />
                              <div className="w-4 h-3 bg-muted rounded-sm self-end" />
                            </div>
                          )}
                          {id === "impact" && (
                            <div className="flex gap-0.5">
                              {[...Array(5)].map((_, i) => (
                                <div
                                  key={i}
                                  className="w-1 bg-primary/60 rounded-full"
                                  style={{ height: `${10 + i * 3}px` }}
                                />
                              ))}
                            </div>
                          )}
                        </div>
                        <p
                          className={cn(
                            "text-xs font-semibold",
                            form.template === id
                              ? "text-primary"
                              : "text-foreground",
                          )}
                        >
                          {label}
                        </p>
                        <p className="text-[10px] text-muted-foreground">
                          {desc}
                        </p>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            {/* Submit */}
            <div className="pb-4">
              <Button
                type="submit"
                className="w-full h-12 text-base font-semibold"
                disabled={loading || !form.topic.trim()}
              >
                {loading ? (
                  <span className="flex items-center gap-2.5">
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Generando video con IA...
                  </span>
                ) : (
                  <span className="flex items-center gap-2.5">
                    <Video className="w-5 h-5" />
                    Generar Video
                    <ChevronRight className="w-4 h-4" />
                  </span>
                )}
              </Button>
              <p className="text-xs text-center text-muted-foreground mt-3">
                El proceso puede tomar varios minutos dependiendo de la duración
                elegida.
              </p>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
