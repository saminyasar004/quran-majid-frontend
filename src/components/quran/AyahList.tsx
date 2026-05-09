"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Play, Pause, BookmarkPlus, Bookmark as BookmarkIcon, BookOpen, MoreHorizontal, ChevronLeft, ChevronRight } from "lucide-react";
import { fetchSurahWithTranslation, TRANSLATION_NAME, type AyahArabic, type AyahTranslated, type SurahData } from "@/lib/quran-api";
import type { QuranSettings } from "@/hooks/use-settings";
import { usePlayer } from "@/hooks/use-player";
import { useBookmarks } from "@/hooks/use-bookmarks";

interface Props {
  surahNumber: number;
  settings: QuranSettings;
}

const FONT_FAMILY_MAP: Record<string, string> = {
  "Amiri (Classic)": "var(--font-amiri), serif",
  "Scheherazade (Modern)": "'Scheherazade New', serif",
  "Noto Naskh (Clean)": "'Noto Naskh Arabic', serif",
};

export function AyahList({ surahNumber, settings }: Props) {
  const [data, setData] = useState<{ surah: SurahData; translations: AyahTranslated[] } | null>(null);
  const [loading, setLoading] = useState(true);
  const { track, playing, playAyah } = usePlayer();
  const { isBookmarked, toggle: toggleBookmark } = useBookmarks();

  const currentFont = FONT_FAMILY_MAP[settings.arabicFontFace] || "var(--font-amiri), serif";

  useEffect(() => {
    setLoading(true);
    fetchSurahWithTranslation(surahNumber, settings.translation)
      .then((d) => { 
        setData(d); 
        setLoading(false); 
      })
      .catch((err) => {
        console.error("Failed to fetch surah:", err);
        setLoading(false);
      });
  }, [surahNumber, settings.translation]);

  if (loading || !data) {
    return (
      <div className="space-y-4 py-8">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-32 rounded-2xl bg-muted animate-pulse" />
        ))}
      </div>
    );
  }

  const { surah, translations } = data;
  const isMakkah = surah.revelationType === "Meccan";

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between py-12 mb-8 border-b border-border/30 relative overflow-hidden px-4 md:px-8 bg-card/30 rounded-3xl mt-4">
        {/* Left: Revelation Type Image */}
        <div className="w-24 md:w-40 shrink-0 transition-all duration-700">
          <Image 
            src={isMakkah ? "/makkah.webp" : "/madinah.webp"} 
            alt={isMakkah ? "Makkah" : "Madinah"}
            width={160}
            height={160}
            className="w-full h-auto object-contain"
            priority
          />
        </div>

        {/* Center: Surah Info */}
        <div className="text-center flex-1 z-10 px-4">
          <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-foreground/90 mb-3">
            {surah.englishName}
          </h1>
          <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20">
            <span className="text-[10px] md:text-xs font-bold text-primary uppercase tracking-widest">
              {surah.numberOfAyahs} Ayahs
            </span>
            <div className="w-1 h-1 rounded-full bg-primary/30" />
            <span className="text-[10px] md:text-xs font-bold text-muted-foreground uppercase tracking-widest">
              {isMakkah ? "Makkah" : "Madinah"}
            </span>
          </div>
        </div>

        {/* Right: Bismillah SVG */}
        <div className="w-24 md:w-40 shrink-0 flex justify-end">
          {surah.number !== 1 && (
            <Image 
              src="/bismillah.svg" 
              alt="Bismillah"
              width={180}
              height={60}
              className="w-full max-w-[180px] h-auto object-contain dark:invert"
              priority
            />
          )}
        </div>
      </div>

      <div className="space-y-0">
        {surah.ayahs.map((ayah, idx) => {
          const trans = translations[idx];
          const isCurrent = track?.surah === surah.number && track?.ayah === ayah.numberInSurah;
          const isPlaying = isCurrent && playing;
          const bookmarked = isBookmarked(surah.number, ayah.numberInSurah);
          
          return (
            <article key={ayah.number} className="group relative flex gap-6 md:gap-10 py-10 first:pt-0 border-b border-border/30 last:border-0">
              {/* Left Column: Number & Actions */}
              <div className="flex flex-col items-center shrink-0 w-12 pt-2">
                <div className="text-xs font-bold text-muted-foreground/60 mb-6 bg-muted/30 px-2 py-1 rounded-md">
                  {surah.number}:{ayah.numberInSurah}
                </div>
                
                <div className="flex flex-col gap-4">
                  <button
                    onClick={() =>
                      playAyah({
                        surah: surah.number,
                        ayah: ayah.numberInSurah,
                        surahName: surah.englishName,
                        globalAyahNumber: ayah.number,
                        totalAyahs: surah.numberOfAyahs,
                      })
                    }
                    className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all ${
                      isPlaying ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20 scale-110" : "text-muted-foreground hover:bg-primary/10 hover:text-primary"
                    }`}
                    aria-label="Play"
                  >
                    {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4" />}
                  </button>

                  <button className="w-9 h-9 rounded-xl text-muted-foreground hover:bg-primary/10 hover:text-primary flex items-center justify-center transition-colors" aria-label="Tafsir">
                    <BookOpen className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() =>
                      toggleBookmark({
                        surah: surah.number,
                        ayah: ayah.numberInSurah,
                        surahName: surah.englishName,
                        text: ayah.text || "",
                      })
                    }
                    className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all ${
                      bookmarked ? "text-primary bg-primary/10" : "text-muted-foreground hover:bg-primary/10 hover:text-primary"
                    }`}
                    aria-label="Bookmark"
                  >
                    {bookmarked ? <BookmarkIcon className="w-4 h-4 fill-current" /> : <BookmarkPlus className="w-4 h-4" />}
                  </button>

                  <button className="w-9 h-9 rounded-xl text-muted-foreground hover:bg-primary/10 hover:text-primary flex items-center justify-center transition-colors" aria-label="More">
                    <MoreHorizontal className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Right Column: Text Content */}
              <div className="flex-1 min-w-0">
                <div className="arabic text-right mb-8 leading-[2.5] text-foreground/90 selection:bg-primary/20" style={{ fontSize: settings.arabicFontSize, fontFamily: currentFont }}>
                  {ayah.text}
                  <span className="inline-flex items-center justify-center mx-4 align-middle text-primary/60 text-sm w-10 h-10 rounded-full border border-primary/20 bg-primary/5 font-bold">
                    {toArabicNumeral(ayah.numberInSurah)}
                  </span>
                </div>

                {settings.showTranslation && trans && (
                  <div className="mt-6 pl-2 border-l-2 border-primary/10">
                    <div className="text-[10px] uppercase tracking-widest text-primary/60 font-bold mb-2">
                      {TRANSLATION_NAME[settings.translation] ?? "Translation"}
                    </div>
                    <p className="text-foreground/80 leading-relaxed font-medium" style={{ fontSize: settings.translationFontSize }}>
                      {trans.text}
                    </p>
                  </div>
                )}
              </div>
            </article>
          );
        })}
      </div>
      <div className="flex items-center justify-center gap-4 py-12 border-t border-border/30 mt-10">
        <Link
          href={`/surah/${surah.number - 1}`}
          className={`flex items-center gap-2 px-8 py-3 rounded-full border border-border/50 bg-muted/20 text-sm font-bold transition-all ${
            surah.number <= 1 ? "opacity-30 pointer-events-none" : "hover:bg-primary/10 hover:border-primary/30 hover:text-primary"
          }`}
        >
          <ChevronLeft className="w-4 h-4" />
          Previous
        </Link>
        <Link
          href={`/surah/${surah.number + 1}`}
          className={`flex items-center gap-2 px-8 py-3 rounded-full border border-border/50 bg-muted/20 text-sm font-bold transition-all ${
            surah.number >= 114 ? "opacity-30 pointer-events-none" : "hover:bg-primary/10 hover:border-primary/30 hover:text-primary"
          }`}
        >
          Next
          <ChevronRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}

function toArabicNumeral(n: number): string {
  return n.toString().split("").map((d) => "٠١٢٣٤٥٦٧٨٩"[Number(d)]).join("");
}
