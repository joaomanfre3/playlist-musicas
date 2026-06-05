"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence } from "framer-motion";
import { Loader2, Music, Search, TriangleAlert } from "lucide-react";
import { type Playlist, type Track } from "@/lib/musica";
import { searchTracks } from "./actions";
import { PlaylistBar } from "@/components/PlaylistBar";
import { TrackRow } from "@/components/TrackRow";
import { NowPlaying } from "@/components/NowPlaying";

const STORAGE_KEY = "playlist-musicas:v1";

export default function Home() {
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [currentId, setCurrentId] = useState("");
  const [hydrated, setHydrated] = useState(false);

  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Track[]>([]);
  const [searching, setSearching] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fila de reprodução (snapshot da lista de onde se tocou) + estado do player.
  const [queue, setQueue] = useState<Track[]>([]);
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);

  const currentTrack = queue[index] ?? null;

  // Carrega as playlists salvas (ou cria a primeira).
  useEffect(() => {
    let saved: Playlist[] = [];
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) saved = JSON.parse(raw);
    } catch {
      /* localStorage indisponível */
    }
    if (saved.length === 0) {
      saved = [{ id: crypto.randomUUID(), name: "Favoritas", tracks: [] }];
    }
    setPlaylists(saved);
    setCurrentId(saved[0].id);
    setHydrated(true);
  }, []);

  // Persiste as playlists.
  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(playlists));
    } catch {
      /* cota cheia / modo privado */
    }
  }, [playlists, hydrated]);

  // Busca com debounce.
  useEffect(() => {
    if (query.trim().length < 2) {
      setResults([]);
      return;
    }
    setSearching(true);
    setError(null);
    const timer = setTimeout(async () => {
      try {
        setResults(await searchTracks(query));
      } catch {
        setError("Não foi possível buscar as músicas. Tente de novo.");
      } finally {
        setSearching(false);
      }
    }, 400);
    return () => clearTimeout(timer);
  }, [query]);

  // Troca a faixa: carrega o áudio e toca se estiver em modo play.
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !currentTrack) return;
    audio.src = currentTrack.previewUrl;
    audio.load();
    if (playing) audio.play().catch(() => setPlaying(false));
    // Só quando a faixa muda de fato.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentTrack?.previewUrl]);

  // Play/pause conforme o estado.
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !currentTrack) return;
    if (playing) audio.play().catch(() => setPlaying(false));
    else audio.pause();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playing]);

  const currentPlaylist = playlists.find((p) => p.id === currentId) ?? null;
  const showingSearch = query.trim().length >= 2;

  function handlePlay(list: Track[], i: number) {
    const t = list[i];
    if (currentTrack && currentTrack.id === t.id) {
      setPlaying((p) => !p);
      return;
    }
    setQueue(list);
    setIndex(i);
    setPlaying(true);
  }

  function next() {
    if (index < queue.length - 1) setIndex(index + 1);
    else setPlaying(false);
  }

  function prev() {
    const audio = audioRef.current;
    if (audio && audio.currentTime > 3) {
      audio.currentTime = 0;
    } else if (index > 0) {
      setIndex(index - 1);
    }
  }

  function seek(seconds: number) {
    const audio = audioRef.current;
    if (audio) {
      audio.currentTime = seconds;
      setCurrentTime(seconds);
    }
  }

  function updatePlaylist(id: string, tracks: Track[]) {
    setPlaylists((prev) => prev.map((p) => (p.id === id ? { ...p, tracks } : p)));
  }

  function addTrack(track: Track) {
    if (!currentPlaylist) return;
    if (currentPlaylist.tracks.some((t) => t.id === track.id)) return;
    updatePlaylist(currentPlaylist.id, [...currentPlaylist.tracks, track]);
  }

  function removeTrack(trackId: number) {
    if (!currentPlaylist) return;
    updatePlaylist(currentPlaylist.id, currentPlaylist.tracks.filter((t) => t.id !== trackId));
  }

  function createPlaylist(name: string) {
    const playlist: Playlist = { id: crypto.randomUUID(), name, tracks: [] };
    setPlaylists((prev) => [...prev, playlist]);
    setCurrentId(playlist.id);
  }

  if (!hydrated) return null;

  const list = showingSearch ? results : currentPlaylist?.tracks ?? [];

  return (
    <main className={`mx-auto flex min-h-dvh max-w-2xl flex-col gap-4 px-4 py-6 ${currentTrack ? "pb-32" : ""}`}>
      <header className="flex items-center gap-2 px-1">
        <Music size={26} style={{ color: "var(--color-accent)" }} />
        <h1 className="text-2xl font-extrabold tracking-tight">Playlists</h1>
      </header>

      {/* Busca */}
      <div className="flex items-center gap-2 rounded-2xl bg-white/5 px-4 ring-1 ring-white/10">
        <Search size={18} className="text-white/40" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Buscar música ou artista..."
          className="w-full bg-transparent py-3 text-base outline-none placeholder:text-white/30"
        />
        {searching && <Loader2 size={18} className="animate-spin text-white/40" />}
      </div>

      {/* Playlists */}
      {!showingSearch && (
        <PlaylistBar
          playlists={playlists}
          currentId={currentId}
          onSelect={setCurrentId}
          onCreate={createPlaylist}
        />
      )}

      {error && (
        <div className="flex items-center gap-2 rounded-xl bg-red-500/10 px-4 py-3 text-sm text-red-300">
          <TriangleAlert size={16} /> {error}
        </div>
      )}

      {/* Lista (resultados da busca ou playlist) */}
      {list.length === 0 ? (
        <div className="flex flex-col items-center gap-2 py-16 text-center text-white/40">
          <Music size={30} strokeWidth={1.5} />
          <p className="text-sm">
            {showingSearch
              ? searching
                ? "Buscando..."
                : "Nenhuma música encontrada."
              : "Esta playlist está vazia. Busque músicas pra adicionar!"}
          </p>
        </div>
      ) : (
        <ul className="flex flex-col gap-1">
          <AnimatePresence initial={false}>
            {list.map((track, i) => (
              <TrackRow
                key={track.id}
                track={track}
                isCurrent={currentTrack?.id === track.id}
                isPlaying={playing}
                mode={showingSearch ? "add" : "remove"}
                inPlaylist={currentPlaylist?.tracks.some((t) => t.id === track.id)}
                onPlay={() => handlePlay(list, i)}
                onAction={() => (showingSearch ? addTrack(track) : removeTrack(track.id))}
              />
            ))}
          </AnimatePresence>
        </ul>
      )}

      {/* Player */}
      {currentTrack && (
        <NowPlaying
          track={currentTrack}
          playing={playing}
          currentTime={currentTime}
          duration={duration}
          onToggle={() => setPlaying((p) => !p)}
          onPrev={prev}
          onNext={next}
          onSeek={seek}
        />
      )}

      {/* Elemento de áudio (oculto) */}
      <audio
        ref={audioRef}
        onTimeUpdate={(e) => setCurrentTime(e.currentTarget.currentTime)}
        onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
        onEnded={next}
      />
    </main>
  );
}
