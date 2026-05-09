"use client";

import { useState } from "react";
import { Play, Pause, SkipBack, SkipForward, X, MoreHorizontal } from "lucide-react";
import { usePlayer, formatTime } from "@/hooks/use-player";
import { AudioSettingsModal } from "./AudioSettingsModal";

export function AudioPlayerBar() {
  const { track, playing, currentTime, duration, toggle, next, prev, seek, close, loading } = usePlayer();
  const [showSettings, setShowSettings] = useState(false);
  
  if (!track) return null;
  
  const pct = duration ? (currentTime / duration) * 100 : 0;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-card/95 backdrop-blur-xl border-t border-border/30 shadow-[0_-10px_40px_rgba(0,0,0,0.5)]">
      {/* Progress Bar Container - Full Width Green Line */}
      <div
        className="absolute -top-[2px] left-0 right-0 h-[3px] bg-muted/10 cursor-pointer group z-10"
        onClick={(e) => {
          const r = e.currentTarget.getBoundingClientRect();
          seek(((e.clientX - r.left) / r.width) * duration);
        }}
      >
        <div 
          className="h-full bg-primary relative transition-[width] duration-150 ease-linear" 
          style={{ width: `${pct}%` }} 
        >
          {/* Thumb dot */}
          <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-primary rounded-full shadow-lg scale-0 group-hover:scale-100 transition-transform" />
        </div>
      </div>

      <div className="flex items-center h-[72px] max-w-screen-2xl mx-auto px-6">
        {/* Left: Track Info */}
        <div className="flex items-center gap-4 min-w-0 w-[20%]">
          <div className="flex flex-col">
            <span className="text-sm font-black text-foreground tracking-tight truncate">
              {track.surahName} : {track.ayah}
            </span>
          </div>
        </div>

        {/* Center: All Controls Grouped */}
        <div className="flex-1 flex items-center justify-center gap-6">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3">
              <span className="text-[11px] font-bold text-muted-foreground/40 tabular-nums">
                {formatTime(currentTime)}
              </span>
            </div>

            <button 
              onClick={() => setShowSettings(true)}
              className="text-muted-foreground/60 hover:text-foreground transition-colors p-1"
            >
              <MoreHorizontal className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-4">
              <button 
                onClick={prev} 
                disabled={track.ayah <= 1}
                className="text-muted-foreground/60 hover:text-foreground transition-colors disabled:opacity-20"
              >
                <SkipBack className="w-5 h-5 fill-current" />
              </button>
              
              <button
                onClick={toggle}
                disabled={loading}
                className="w-11 h-11 rounded-full bg-primary text-primary-foreground flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-lg shadow-primary/20 disabled:opacity-50"
              >
                {playing ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current ml-0.5" />}
              </button>
              
              <button 
                onClick={next} 
                disabled={track.ayah >= track.totalAyahs}
                className="text-muted-foreground/60 hover:text-foreground transition-colors disabled:opacity-20"
              >
                <SkipForward className="w-5 h-5 fill-current" />
              </button>
            </div>

            <button 
              onClick={close} 
              className="text-muted-foreground/60 hover:text-foreground transition-colors p-1"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3">
              <span className="text-[11px] font-bold text-muted-foreground/40 tabular-nums">
                {formatTime(duration)}
              </span>
            </div>
          </div>
        </div>

        {/* Right: Empty spacer to balance track info */}
        <div className="w-[20%] hidden md:block" />
      </div>

      <AudioSettingsModal open={showSettings} onClose={() => setShowSettings(false)} />
    </div>
  );
}
