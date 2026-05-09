"use client";

import { useEffect, useState } from "react";

export interface QuranSettings {
  arabicFontSize: number;
  translationFontSize: number;
  arabicFontFace: string;
  translation: string;
  reciter: string;
  showTranslation: boolean;
  theme: "light" | "dark";
}

const DEFAULT: QuranSettings = {
  arabicFontSize: 30,
  translationFontSize: 17,
  arabicFontFace: "KFGQ",
  translation: "en.sahih",
  reciter: "ar.alafasy",
  showTranslation: true,
  theme: "dark",
};

const KEY = "qm-settings";

export function useSettings() {
  const [settings, setSettings] = useState<QuranSettings>(DEFAULT);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setSettings({ ...DEFAULT, ...JSON.parse(raw) });
    } catch {}
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (!loaded) return;
    localStorage.setItem(KEY, JSON.stringify(settings));
    document.documentElement.classList.toggle("dark", settings.theme === "dark");
  }, [settings, loaded]);

  const update = <K extends keyof QuranSettings>(key: K, value: QuranSettings[K]) =>
    setSettings((s) => ({ ...s, [key]: value }));

  return { settings, update, loaded };
}
