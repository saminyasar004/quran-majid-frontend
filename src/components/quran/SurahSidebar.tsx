"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { Search } from "lucide-react";
import { fetchSurahList, JUZ_STARTS, type SurahMeta } from "@/lib/quran-api";

type Tab = "Surah" | "Juz" | "Page";

export function SurahSidebar() {
  const params = useParams() as { surahId?: string };
  const currentSurah = Number(params.surahId ?? 1);
  const [tab, setTab] = useState<Tab>("Surah");
  const [q, setQ] = useState("");
  const [surahs, setSurahs] = useState<SurahMeta[]>([]);

  useEffect(() => {
    fetchSurahList().then(setSurahs).catch(() => {});
  }, []);

  const filteredSurahs = useMemo(
    () =>
      surahs.filter(
        (s) =>
          s.nameEnglish.toLowerCase().includes(q.toLowerCase()) ||
          s.nameTranslation.toLowerCase().includes(q.toLowerCase()) ||
          s.number.toString() === q
      ),
    [surahs, q]
  );

  return (
    <aside className="bg-card rounded-2xl border border-border/50 p-3 h-full flex flex-col overflow-hidden">
      <div className="grid grid-cols-3 bg-muted/30 rounded-full p-1 text-sm font-semibold mb-4">
        {(["Surah", "Juz", "Page"] as Tab[]).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`h-9 rounded-full transition-all duration-200 ${
              tab === t ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/60" />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder={`Search ${tab}...`}
          className="w-full bg-muted/30 border border-border/30 rounded-full h-11 pl-10 pr-4 text-sm outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all"
        />
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar -mr-2 pr-2 space-y-1.5">
        {tab === "Surah" &&
          filteredSurahs.map((s) => {
            const active = s.number === currentSurah;
            return (
              <Link
                key={s.number}
                href={`/surah/${s.number}`}
                className={`flex items-center gap-3 p-2.5 rounded-xl border transition-all duration-200 ${
                  active 
                    ? "bg-primary/10 border-primary/50 shadow-sm" 
                    : "border-transparent hover:bg-muted/50 hover:border-border/50"
                }`}
              >
                <div
                  className={`w-9 h-9 rounded-lg flex items-center justify-center text-xs font-black shrink-0 ${
                    active ? "bg-primary text-primary-foreground" : "bg-muted/50 text-muted-foreground"
                  }`}
                  style={active ? { clipPath: "polygon(50% 0,100% 25%,100% 75%,50% 100%,0 75%,0 25%)" } : undefined}
                >
                  {s.number}
                </div>
                <div className="flex-1 min-w-0">
                  <div className={`text-sm font-bold truncate ${active ? "text-primary" : "text-foreground/90"}`}>
                    {s.nameEnglish}
                  </div>
                  <div className="text-[10px] text-muted-foreground uppercase font-semibold tracking-wider truncate">
                    {s.nameTranslation}
                  </div>
                </div>
                <div className="arabic text-sm text-primary/80 truncate font-medium">
                  {s.nameArabic.replace("سُورَةُ ", "")}
                </div>
              </Link>
            );
          })}
        {/* Juz and Page tabs kept as before with minor style updates */}
        {tab === "Juz" &&
          JUZ_STARTS.filter((j) => j.juz.toString().includes(q) || !q).map((j) => (
            <Link
              key={j.juz}
              href={`/surah/${j.surah}`}
              className="flex items-center gap-3 p-2.5 rounded-xl border border-transparent hover:bg-muted/50 hover:border-border/50 transition-all"
            >
              <div className="w-9 h-9 rounded-lg bg-muted/50 text-xs font-black flex items-center justify-center shrink-0">{j.juz}</div>
              <div className="flex-1">
                <div className="text-sm font-bold text-foreground/90">Juz {j.juz}</div>
                <div className="text-[10px] text-muted-foreground uppercase font-semibold">Surah {j.surah}:{j.ayah}</div>
              </div>
            </Link>
          ))}
      </div>
    </aside>
  );
}
