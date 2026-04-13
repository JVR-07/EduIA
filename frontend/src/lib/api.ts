const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

export interface VideoInputs {
  topic: string;
  language: string;
  level: string;
  style: string;
  duration_hint: string;
  orientation: string;
  template: string;
  target_audience?: string;
  extra_notes?: string;
}

export interface VideoEntry {
  id: string;
  created_at: string;
  inputs: VideoInputs;
  script: Record<string, unknown>;
  audio_files: Record<string, string>;
  video_path: string | null;
  status: string;
}

export async function generateVideo(
  inputs: VideoInputs,
): Promise<{ id: string; script: unknown }> {
  const res = await fetch(`${API_URL}/video/generate-script`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(inputs),
  });
  if (!res.ok) throw new Error(`Error ${res.status}: ${await res.text()}`);
  return res.json();
}

export async function getHistory(): Promise<VideoEntry[]> {
  const res = await fetch(`${API_URL}/video/history`);
  if (!res.ok) throw new Error(`Error ${res.status}`);
  const data = await res.json();
  return data.videos ?? [];
}

export async function getVideo(id: string): Promise<VideoEntry> {
  const res = await fetch(`${API_URL}/video/${id}`);
  if (!res.ok) throw new Error(`Error ${res.status}`);
  return res.json();
}
