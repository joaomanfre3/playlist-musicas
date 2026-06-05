"use client";

import { motion } from "framer-motion";
import { Check, Pause, Play, Plus, Trash2 } from "lucide-react";
import type { Track } from "@/lib/musica";

interface TrackRowProps {
  track: Track;
  isCurrent: boolean;
  isPlaying: boolean;
  /** "add" no modo busca, "remove" dentro da playlist. */
  mode: "add" | "remove";
  /** Já está na playlist atual (mostra check no modo busca). */
  inPlaylist?: boolean;
  onPlay: () => void;
  onAction: () => void;
}

export function TrackRow({
  track,
  isCurrent,
  isPlaying,
  mode,
  inPlaylist,
  onPlay,
  onAction,
}: TrackRowProps) {
  return (
    <motion.li
      layout
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -12 }}
      className={`flex items-center gap-3 rounded-xl p-2 transition ${
        isCurrent ? "bg-white/10" : "hover:bg-white/5"
      }`}
    >
      {/* Capa + play */}
      <button
        onClick={onPlay}
        className="group relative h-12 w-12 shrink-0 overflow-hidden rounded-lg"
        aria-label={isCurrent && isPlaying ? "Pausar" : "Tocar"}
      >
        {track.artwork ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={track.artwork} alt="" className="h-full w-full object-cover" />
        ) : (
          <span className="flex h-full w-full items-center justify-center bg-white/10" />
        )}
        <span className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition group-hover:opacity-100" style={{ opacity: isCurrent ? 1 : undefined }}>
          {isCurrent && isPlaying ? <Pause size={18} /> : <Play size={18} />}
        </span>
      </button>

      <div className="min-w-0 flex-1">
        <p className={`truncate font-semibold ${isCurrent ? "text-accent" : ""}`} style={isCurrent ? { color: "var(--color-accent)" } : undefined}>
          {track.title}
        </p>
        <p className="truncate text-sm text-white/50">{track.artist}</p>
      </div>

      {/* Ação */}
      <button
        onClick={onAction}
        disabled={mode === "add" && inPlaylist}
        aria-label={mode === "add" ? "Adicionar à playlist" : "Remover da playlist"}
        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full transition ${
          mode === "remove"
            ? "text-white/40 hover:bg-red-500/20 hover:text-red-300"
            : inPlaylist
              ? "text-emerald-400"
              : "bg-white/10 text-white hover:bg-white/20"
        }`}
      >
        {mode === "remove" ? (
          <Trash2 size={16} />
        ) : inPlaylist ? (
          <Check size={18} />
        ) : (
          <Plus size={18} />
        )}
      </button>
    </motion.li>
  );
}
