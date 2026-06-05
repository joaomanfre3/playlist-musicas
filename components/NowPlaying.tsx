"use client";

import { Pause, Play, SkipBack, SkipForward } from "lucide-react";
import { type Track, formatTime } from "@/lib/musica";

interface NowPlayingProps {
  track: Track;
  playing: boolean;
  currentTime: number;
  duration: number;
  onToggle: () => void;
  onPrev: () => void;
  onNext: () => void;
  onSeek: (seconds: number) => void;
}

export function NowPlaying({
  track,
  playing,
  currentTime,
  duration,
  onToggle,
  onPrev,
  onNext,
  onSeek,
}: NowPlayingProps) {
  const ratio = duration > 0 ? currentTime / duration : 0;

  function seek(e: React.MouseEvent<HTMLDivElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    const pct = (e.clientX - rect.left) / rect.width;
    onSeek(Math.max(0, Math.min(1, pct)) * duration);
  }

  return (
    <div className="fixed inset-x-0 bottom-0 z-30 border-t border-white/10 bg-card/95 backdrop-blur" style={{ backgroundColor: "color-mix(in srgb, var(--color-card) 92%, transparent)" }}>
      {/* Barra de progresso (clicável) */}
      <div className="h-1.5 w-full cursor-pointer bg-white/10" onClick={seek}>
        <div className="h-full" style={{ width: `${ratio * 100}%`, backgroundColor: "var(--color-accent)" }} />
      </div>

      <div className="mx-auto flex max-w-2xl items-center gap-3 px-4 py-3">
        {track.artwork && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={track.artwork} alt="" className="h-12 w-12 shrink-0 rounded-lg object-cover" />
        )}
        <div className="min-w-0 flex-1">
          <p className="truncate font-semibold">{track.title}</p>
          <p className="truncate text-sm text-white/50">{track.artist}</p>
        </div>

        <span className="tnum hidden text-xs text-white/40 sm:block">
          {formatTime(currentTime)} / {formatTime(duration)}
        </span>

        <div className="flex items-center gap-1">
          <button onClick={onPrev} aria-label="Anterior" className="flex h-9 w-9 items-center justify-center rounded-full text-white/70 transition hover:bg-white/10">
            <SkipBack size={18} />
          </button>
          <button
            onClick={onToggle}
            aria-label={playing ? "Pausar" : "Tocar"}
            className="flex h-11 w-11 items-center justify-center rounded-full text-black transition active:scale-95"
            style={{ backgroundColor: "var(--color-accent)" }}
          >
            {playing ? <Pause size={20} /> : <Play size={20} />}
          </button>
          <button onClick={onNext} aria-label="Próxima" className="flex h-9 w-9 items-center justify-center rounded-full text-white/70 transition hover:bg-white/10">
            <SkipForward size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
