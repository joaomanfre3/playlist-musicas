"use server";

import { type Track, upscaleArtwork } from "@/lib/musica";

interface RawTrack {
  trackId: number;
  trackName: string;
  artistName: string;
  collectionName?: string;
  artworkUrl100?: string;
  previewUrl?: string;
}

/**
 * Server Action: busca músicas na iTunes Search API (gratuita, sem token).
 *
 * Roda no servidor — o navegador não fala com a Apple direto (evita CORS).
 * Retorna só faixas que têm prévia de áudio disponível.
 */
export async function searchTracks(term: string): Promise<Track[]> {
  const q = term.trim();
  if (q.length < 2) return [];

  const url =
    `https://itunes.apple.com/search?term=${encodeURIComponent(q)}` +
    `&media=music&entity=song&limit=24&country=BR`;

  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) throw new Error("Não foi possível buscar as músicas agora.");

  const data: { results?: RawTrack[] } = await res.json();
  return (data.results ?? [])
    .filter((r) => r.previewUrl)
    .map((r) => ({
      id: r.trackId,
      title: r.trackName,
      artist: r.artistName,
      album: r.collectionName ?? "",
      artwork: r.artworkUrl100 ? upscaleArtwork(r.artworkUrl100) : "",
      previewUrl: r.previewUrl!,
    }));
}
