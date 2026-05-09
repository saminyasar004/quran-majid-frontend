"use client";

import { useEffect, useState, useCallback } from "react";

export interface Bookmark {
  surah: number;
  ayah: number;
  surahName: string;
  text: string;
  addedAt: number;
}

const KEY = "qm-bookmarks";
const EVT = "qm-bookmarks-changed";

function read(): Bookmark[] {
  try {
    return JSON.parse(localStorage.getItem(KEY) || "[]");
  } catch {
    return [];
  }
}

export function useBookmarks() {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);

  useEffect(() => {
    setBookmarks(read());
    const h = () => setBookmarks(read());
    window.addEventListener(EVT, h);
    window.addEventListener("storage", h);
    return () => {
      window.removeEventListener(EVT, h);
      window.removeEventListener("storage", h);
    };
  }, []);

  const isBookmarked = useCallback(
    (surah: number, ayah: number) =>
      bookmarks.some((b) => b.surah === surah && b.ayah === ayah),
    [bookmarks]
  );

  const toggle = useCallback((b: Omit<Bookmark, "addedAt">) => {
    const list = read();
    const idx = list.findIndex((x) => x.surah === b.surah && x.ayah === b.ayah);
    const next =
      idx >= 0
        ? list.filter((_, i) => i !== idx)
        : [...list, { ...b, addedAt: Date.now() }];
    localStorage.setItem(KEY, JSON.stringify(next));
    window.dispatchEvent(new Event(EVT));
  }, []);

  const remove = useCallback((surah: number, ayah: number) => {
    const next = read().filter((x) => !(x.surah === surah && x.ayah === ayah));
    localStorage.setItem(KEY, JSON.stringify(next));
    window.dispatchEvent(new Event(EVT));
  }, []);

  return { bookmarks, isBookmarked, toggle, remove };
}
