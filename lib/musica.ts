// Tipos e utilidades do player — lógica pura, sem React.

export interface Track {
  id: number;
  title: string;
  artist: string;
  album: string;
  /** Capa do álbum (URL). */
  artwork: string;
  /** Prévia de ~30s (áudio direto da Apple). */
  previewUrl: string;
}

export interface Playlist {
  id: string;
  name: string;
  tracks: Track[];
}

/** Formata segundos como "m:ss". */
export function formatTime(seconds: number): string {
  if (!Number.isFinite(seconds)) return "0:00";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${String(s).padStart(2, "0")}`;
}

/** Sobe a resolução da capa do iTunes (100x100 -> 300x300). */
export function upscaleArtwork(url: string): string {
  return url.replace("100x100", "300x300");
}
