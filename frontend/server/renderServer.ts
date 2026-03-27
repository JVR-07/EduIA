/**
 * Servidor de render de Remotion
 * Python llama a POST /render con el JSON del guión
 * Devuelve la ruta del MP4 generado
 *
 * Instalar: npm install @remotion/renderer express cors
 */
import express from "express";
import cors from "cors";
import path from "path";
import fs from "fs";
import { bundle } from "@remotion/bundler";
import { renderMedia, selectComposition } from "@remotion/renderer";
import { createRequire } from "module";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json({ limit: "50mb" }));

// Directorio de salida para los videos
const OUTPUT_DIR = path.join(__dirname, "../../outputs");
if (!fs.existsSync(OUTPUT_DIR)) fs.mkdirSync(OUTPUT_DIR, { recursive: true });

let bundled: string | null = null;

// Pre-bundle al arrancar (una sola vez)
async function getBundled() {
  if (!bundled) {
    console.log("Bundling Remotion project...");
    bundled = await bundle({
      entryPoint: path.join(__dirname, "../src/video/index.ts"),
      webpackOverride: (config) => config,
    });
    console.log("Bundle ready.");
  }
  return bundled;
}

interface RenderRequest {
  title: string;
  sections: {
    introduccion: { text: string; duration: number };
    explicacion: { text: string; duration: number };
    ejemplo: {
      text: string;
      duration: number;
      charts?: Array<{
        type: "bar" | "line";
        title: string;
        data: Array<{ name: string; value: number }>;
      }>;
    };
    conclusion: { text: string; duration: number };
  };
  audioPaths: {
    introduccion: string;
    explicacion: string;
    ejemplo: string;
    conclusion: string;
  };
  outputName?: string;
}

app.post("/render", async (req, res) => {
  const body: RenderRequest = req.body;
  const outputName = body.outputName || `video_${Date.now()}.mp4`;
  const outputPath = path.join(OUTPUT_DIR, outputName);

  try {
    const serveUrl = await getBundled();

    // Calcular duración total en frames (30fps)
    const fps = 30;
    const totalFrames =
      (body.sections.introduccion.duration +
        body.sections.explicacion.duration +
        body.sections.ejemplo.duration +
        body.sections.conclusion.duration) *
      fps;

    const inputProps = {
      script: {
        title: body.title,
        sections: body.sections,
      },
      audioPaths: body.audioPaths,
    };

    const composition = await selectComposition({
      serveUrl,
      id: "EngineeringVideo",
      inputProps,
    });

    // Sobrescribir duración calculada
    composition.durationInFrames = totalFrames;

    await renderMedia({
      composition,
      serveUrl,
      codec: "h264",
      outputLocation: outputPath,
      inputProps,
      timeoutInMilliseconds: 300_000,
      onProgress: ({ progress }) => {
        process.stdout.write(`\rRender progress: ${Math.round(progress * 100)}%`);
      },
    });

    console.log(`\nVideo generado: ${outputPath}`);
    res.json({ success: true, outputPath, outputName });
  } catch (err: any) {
    console.error("Error en render:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});

app.get("/health", (_req, res) => res.json({ status: "ok" }));

const PORT = process.env.REMOTION_PORT || 3001;
app.listen(PORT, () => {
  console.log(`Remotion render server corriendo en http://localhost:${PORT}`);
  // Pre-bundle en background
  getBundled().catch(console.error);
});