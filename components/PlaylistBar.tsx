"use client";

import { useState } from "react";
import { Check, Plus, X } from "lucide-react";
import type { Playlist } from "@/lib/musica";

interface PlaylistBarProps {
  playlists: Playlist[];
  currentId: string;
  onSelect: (id: string) => void;
  onCreate: (name: string) => void;
}

export function PlaylistBar({ playlists, currentId, onSelect, onCreate }: PlaylistBarProps) {
  const [creating, setCreating] = useState(false);
  const [name, setName] = useState("");

  function confirm() {
    const trimmed = name.trim();
    if (trimmed) onCreate(trimmed);
    setName("");
    setCreating(false);
  }

  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-1">
      {playlists.map((p) => {
        const active = p.id === currentId;
        return (
          <button
            key={p.id}
            onClick={() => onSelect(p.id)}
            className={`flex shrink-0 items-center gap-1.5 rounded-full px-4 py-2 text-sm font-semibold transition ${
              active ? "text-white" : "bg-white/5 text-white/60 hover:bg-white/10"
            }`}
            style={active ? { backgroundColor: "var(--color-accent)" } : undefined}
          >
            {p.name}
            <span className={active ? "text-white/70" : "text-white/30"}>{p.tracks.length}</span>
          </button>
        );
      })}

      {/* Criar nova playlist */}
      {creating ? (
        <div className="flex shrink-0 items-center gap-1 rounded-full bg-white/10 pl-3 pr-1">
          <input
            autoFocus
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") confirm();
              if (e.key === "Escape") setCreating(false);
            }}
            placeholder="Nome"
            maxLength={24}
            className="w-24 bg-transparent py-1.5 text-sm outline-none placeholder:text-white/30"
          />
          <button onClick={confirm} aria-label="Criar" className="flex h-7 w-7 items-center justify-center rounded-full text-emerald-400">
            <Check size={16} />
          </button>
          <button onClick={() => setCreating(false)} aria-label="Cancelar" className="flex h-7 w-7 items-center justify-center rounded-full text-white/40">
            <X size={16} />
          </button>
        </div>
      ) : (
        <button
          onClick={() => setCreating(true)}
          aria-label="Nova playlist"
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/5 text-white/60 transition hover:bg-white/10"
        >
          <Plus size={18} />
        </button>
      )}
    </div>
  );
}
