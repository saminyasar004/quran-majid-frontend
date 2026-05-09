"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, BookOpen, Bookmark, Send, Grid3x3, BookMarked } from "lucide-react";

const items = [
  { icon: Home, to: "/", label: "Home" },
  { icon: Grid3x3, to: "/surah/1", label: "Surahs" },
  { icon: Send, to: "/surah/1", label: "Share" },
  { icon: BookMarked, to: "/surah/1", label: "Read" },
  { icon: Bookmark, to: "/surah/1", label: "Bookmarks" },
];

export function LeftRail() {
  const pathname = usePathname();
  
  return (
    <aside className="hidden md:flex fixed left-0 top-0 bottom-0 z-30 w-16 flex-col items-center pt-3 pb-24 bg-background border-r">
      <Link
        href="/surah/1"
        className="w-11 h-11 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-4 transition-colors hover:bg-primary/20"
        aria-label="Quran Mazid"
      >
        <BookOpen className="w-6 h-6" />
      </Link>
      <nav className="flex-1 flex flex-col items-center gap-2">
        {items.map((it, i) => {
          const active = it.to === "/" ? pathname === "/" : pathname?.startsWith(it.to);
          
          return (
            <Link
              key={i}
              href={it.to}
              className={`w-11 h-11 rounded-xl flex items-center justify-center transition ${
                active ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
              aria-label={it.label}
              title={it.label}
            >
              <it.icon className="w-5 h-5" />
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
