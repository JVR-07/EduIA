import React, { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Video, Eye, EyeOff, ArrowRight, Sparkles } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"

export function LoginPage() {
  const navigate = useNavigate()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPwd, setShowPwd] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setTimeout(() => navigate("/"), 800)
  }

  return (
    <div className="min-h-screen flex bg-background">
      {/* Left panel — branding */}
      <div className="hidden lg:flex flex-col flex-1 relative overflow-hidden bg-gradient-to-br from-[oklch(0.08_0.018_145)] to-[oklch(0.12_0.04_145)] border-r border-border p-10">
        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: "linear-gradient(oklch(0.3 0.06 145 / 0.3) 1px, transparent 1px), linear-gradient(90deg, oklch(0.3 0.06 145 / 0.3) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />
        {/* Glow orb */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-primary/10 blur-3xl pointer-events-none" />

        {/* Logo */}
        <div className="relative flex items-center gap-3 z-10">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-primary/20 border border-primary/30">
            <Video className="w-5 h-5 text-primary" />
          </div>
          <span className="text-lg font-bold text-foreground tracking-tight">EduIA</span>
        </div>

        {/* Hero copy */}
        <div className="relative z-10 mt-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-primary/20 bg-primary/5 mb-6">
            <Sparkles className="w-3 h-3 text-primary" />
            <span className="text-xs text-primary font-medium">Powered by Gemini AI</span>
          </div>
          <h1 className="text-4xl font-bold text-foreground leading-tight mb-4">
            Crea videos<br />
            <span className="text-primary">educativos</span><br />
            en minutos.
          </h1>
          <p className="text-muted-foreground text-base leading-relaxed max-w-sm">
            Genera guiones, locuciones y visualizaciones dinámicas con IA. Solo ingresa tu tema y nosotros hacemos el resto.
          </p>

          {/* Feature pills */}
          <div className="flex flex-wrap gap-2 mt-6">
            {["Gemini AI", "Remotion", "TTS", "Recharts"].map((tag) => (
              <span key={tag} className="text-xs px-2.5 py-1 rounded-md bg-primary/10 border border-primary/20 text-primary font-medium">
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Right panel — form */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm">
          {/* Mobile logo */}
          <div className="flex lg:hidden items-center justify-center gap-2.5 mb-8">
            <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-primary/20 border border-primary/30">
              <Video className="w-4.5 h-4.5 text-primary" />
            </div>
            <span className="text-lg font-bold text-foreground">EduIA</span>
          </div>

          <h2 className="text-2xl font-bold text-foreground mb-1.5">Bienvenido</h2>
          <p className="text-sm text-muted-foreground mb-8">Inicia sesión para continuar</p>

          <form onSubmit={handleLogin} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email">Correo electrónico</Label>
              <Input
                id="email"
                type="email"
                placeholder="docente@escuela.edu"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-10"
                autoComplete="email"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Contraseña</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPwd ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-10 pr-10"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPwd(!showPwd)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full h-10 font-medium"
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-primary-foreground/40 border-t-primary-foreground rounded-full animate-spin" />
                  Iniciando...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  Iniciar sesión
                  <ArrowRight className="w-4 h-4" />
                </span>
              )}
            </Button>
          </form>

          <p className="text-xs text-center text-muted-foreground mt-8">
            Demo visual · Sin autenticación real
          </p>
        </div>
      </div>
    </div>
  )
}
