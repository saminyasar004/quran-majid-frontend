"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { fetchSurahList, type SurahMeta } from "@/lib/quran-api";
import { Book, ChevronDown, Settings2, History } from "lucide-react";

export function SearchDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [q, setQ] = useState("");
  const [surahs, setSurahs] = useState<SurahMeta[]>([]);

  useEffect(() => {
    if (open && surahs.length === 0) fetchSurahList().then(setSurahs).catch(() => {});
  }, [open, surahs.length]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    if (open) window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  const filtered = surahs.filter(
    (s) =>
      s.nameEnglish.toLowerCase().includes(q.toLowerCase()) ||
      s.nameTranslation.toLowerCase().includes(q.toLowerCase()) ||
      s.number.toString() === q
  );

  const quickLinks = [
    { label: "Al-Fatiha", href: "/surah/1" },
    { label: "Juz 30", href: "/surah/78" },
    { label: "Surah Yasin", href: "/surah/36" },
    { label: "Page 1", href: "/surah/1" },
  ];

  return (
    <div 
      className="fixed inset-0 z-50 bg-background/60 backdrop-blur-md flex items-start justify-center pt-[15vh] px-4 animate-in fade-in duration-200" 
      onClick={onClose}
    >
      <div 
        className="bg-card/95 border border-border/50 rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden animate-in zoom-in-95 duration-200" 
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center gap-4 px-6 h-16 border-b border-border/30">
          <div className="flex items-center gap-2 flex-1">
            <Book className="w-5 h-5 text-primary" />
            <input
              autoFocus
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Find wisdom in the Quran"
              className="bg-transparent border-none outline-none text-base font-medium placeholder:text-muted-foreground/60 w-full"
            />
          </div>
          
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-1.5 px-3 py-1.5 bg-muted/50 hover:bg-muted rounded-full text-xs font-bold transition-colors">
              <span>Quran</span>
              <ChevronDown className="w-3 h-3" />
            </button>
            <button className="p-2 text-muted-foreground hover:text-foreground transition-colors">
              <Settings2 className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-8 max-h-[60vh] overflow-y-auto custom-scrollbar">
          {q.length === 0 ? (
            <>
              {/* Quick Navigation */}
              <div>
                <h3 className="text-xs font-black uppercase tracking-widest text-muted-foreground/60 mb-4 px-1">
                  Try to navigate
                </h3>
                <div className="flex flex-wrap gap-2">
                  {quickLinks.map((link) => (
                    <Link
                      key={link.label}
                      href={link.href}
                      onClick={onClose}
                      className="px-4 py-2.5 bg-muted/30 hover:bg-primary/10 hover:text-primary border border-border/30 rounded-xl text-sm font-bold transition-all"
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
              </div>

              {/* Recent Navigation */}
              <div>
                <h3 className="text-xs font-black uppercase tracking-widest text-muted-foreground/60 mb-4 px-1">
                  Recent Navigation
                </h3>
                <div className="flex flex-col items-center justify-center py-10 text-center">
                  <div className="w-12 h-12 rounded-full bg-muted/30 flex items-center justify-center mb-3">
                    <History className="w-6 h-6 text-muted-foreground/40" />
                  </div>
                  <p className="text-sm font-medium text-muted-foreground/60">No recent navigation</p>
                </div>
              </div>
            </>
          ) : (
            <div className="space-y-1">
              <h3 className="text-xs font-black uppercase tracking-widest text-muted-foreground/60 mb-4 px-1">
                Search Results ({filtered.length})
              </h3>
              {filtered.slice(0, 20).map((s) => (
                <Link
                  key={s.number}
                  href={`/surah/${s.number}`}
                  onClick={onClose}
                  className="flex items-center gap-4 p-3 hover:bg-primary/10 border border-transparent hover:border-primary/20 rounded-2xl transition-all group"
                >
                  <div className="w-10 h-10 rounded-xl bg-muted/50 flex items-center justify-center text-xs font-black group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                    {s.number}
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-bold">{s.nameEnglish}</div>
                    <div className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">{s.nameTranslation}</div>
                  </div>
                  <div className="arabic text-xl text-primary/80">{s.nameArabic.replace("سُورَةُ ", "")}</div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
