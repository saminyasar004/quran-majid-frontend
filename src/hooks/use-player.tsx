"use client";

import { createContext, useContext, useEffect, useRef, useState, useCallback, type ReactNode } from "react";
import { fetchAyahAudio, fetchSurahWithTranslation } from "@/lib/quran-api";

export interface PlayerTrack {
  surah: number;
  ayah: number;
  surahName: string;
  globalAyahNumber: number;
  totalAyahs: number;
}

interface PlayerCtx {
  track: PlayerTrack | null;
  playing: boolean;
  currentTime: number;
  duration: number;
  loading: boolean;
  reciter: string;
  playbackSpeed: number;
  repeat: boolean;
  setReciter: (r: string) => void;
  setPlaybackSpeed: (s: number) => void;
  setRepeat: (r: boolean) => void;
  playAyah: (t: PlayerTrack) => Promise<void>;
  toggle: () => void;
  next: () => void;
  prev: () => void;
  seek: (s: number) => void;
  close: () => void;
}

const Ctx = createContext<PlayerCtx | null>(null);

export function PlayerProvider({ children }: { children: ReactNode }) {
  const [track, setTrack] = useState<PlayerTrack | null>(null);
  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [loading, setLoading] = useState(false);
  const [reciter, setReciter] = useState("ar.alafasy");
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [repeat, setRepeat] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const load = useCallback(async (t: PlayerTrack, autoplay = true) => {
    setLoading(true);
    try {
      const url = await fetchAyahAudio(t.globalAyahNumber, reciter);
      audioRef.current?.pause();
      const a = new Audio(url);
      a.playbackRate = playbackSpeed;
      audioRef.current = a;
      a.ontimeupdate = () => setCurrentTime(a.currentTime);
      a.onloadedmetadata = () => setDuration(a.duration || 0);
      a.onended = () => {
        if (repeat) {
          a.currentTime = 0;
          a.play();
        } else {
          setPlaying(false);
          // auto-advance
          if (t.ayah < t.totalAyahs) {
            load({ ...t, ayah: t.ayah + 1, globalAyahNumber: t.globalAyahNumber + 1 });
          }
        }
      };
      setTrack(t);
      if (autoplay) {
        await a.play();
        setPlaying(true);
      }
    } finally {
      setLoading(false);
    }
  }, [reciter, playbackSpeed, repeat]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.playbackRate = playbackSpeed;
    }
  }, [playbackSpeed]);

  const playAyah = useCallback(async (t: PlayerTrack) => {
    if (track && track.surah === t.surah && track.ayah === t.ayah && audioRef.current) {
      if (playing) {
        audioRef.current.pause();
        setPlaying(false);
      } else {
        await audioRef.current.play();
        setPlaying(true);
      }
      return;
    }
    await load(t);
  }, [track, playing, load]);

  const toggle = useCallback(() => {
    if (!audioRef.current) return;
    if (playing) {
      audioRef.current.pause();
      setPlaying(false);
    } else {
      audioRef.current.play();
      setPlaying(true);
    }
  }, [playing]);

  const next = useCallback(() => {
    if (!track) return;
    if (track.ayah < track.totalAyahs) {
      load({ ...track, ayah: track.ayah + 1, globalAyahNumber: track.globalAyahNumber + 1 });
    }
  }, [track, load]);

  const prev = useCallback(() => {
    if (!track || track.ayah <= 1) return;
    load({ ...track, ayah: track.ayah - 1, globalAyahNumber: track.globalAyahNumber - 1 });
  }, [track, load]);

  const seek = useCallback((s: number) => {
    if (!audioRef.current) return;
    audioRef.current.currentTime = s;
    setCurrentTime(s);
  }, []);

  const close = useCallback(() => {
    audioRef.current?.pause();
    audioRef.current = null;
    setTrack(null);
    setPlaying(false);
    setCurrentTime(0);
    setDuration(0);
  }, []);

  useEffect(() => () => audioRef.current?.pause(), []);

  return (
    <Ctx.Provider
      value={{
        track,
        playing,
        currentTime,
        duration,
        loading,
        reciter,
        playbackSpeed,
        repeat,
        setReciter,
        setPlaybackSpeed,
        setRepeat,
        playAyah,
        toggle,
        next,
        prev,
        seek,
        close,
      }}
    >
      {children}
    </Ctx.Provider>
  );
}

export function usePlayer() {
  const c = useContext(Ctx);
  if (!c) throw new Error("usePlayer must be used within PlayerProvider");
  return c;
}

export function formatTime(s: number) {
  if (!isFinite(s)) return "00:00";
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${m.toString().padStart(2, "0")}:${sec.toString().padStart(2, "0")}`;
}
