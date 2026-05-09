"use client";

import { Link, useRouterState } from "@tanstack/react-router";
import { Home, BookOpen, Bookmark, Send, Grid3x3, BookMarked } from "lucide-react";

const items = [
  { icon: Home, to: "/", label: "Home" },
  { icon: Grid3x3, to: "/$surahId", params: { surahId: "1" }, label: "Surahs" },
  { icon: Send, to: "/$surahId", params: { surahId: "1" }, label: "Share" },
  { icon: BookMarked, to: "/$surahId", params: { surahId: "1" }, label: "Read" },
  { icon: Bookmark, to: "/$surahId", params: { surahId: "1" }, label: "Bookmarks" },
];

export function LeftRail() {
  const path = useRouterState({ select: (r) => r.location.pathname });
  return (
    <aside className="hidden md:flex fixed left-0 top-0 bottom-0 z-30 w-16 flex-col items-center pt-3 pb-24 bg-background border-r">
      <Link
        to="/$surahId"
        params={{ surahId: "1" }}
        className="w-11 h-11 rounded-xl bg-primary-soft text-primary flex items-center justify-center mb-4"
        aria-label="Quran Mazid"
      >
        <BookOpen className="w-6 h-6" />
      </Link>
      <nav className="flex-1 flex flex-col items-center gap-2">
        {items.map((it, i) => {
          const active = i === 0 ? path === "/" : path.startsWith("/") && i === 1;
          return (
            <Link
              key={i}
              to={it.to as string}
              params={it.params as never}
              className={`w-11 h-11 rounded-xl flex items-center justify-center transition ${
                active ? "bg-primary-soft text-primary" : "text-muted-foreground hover:bg-muted hover:text-foreground"
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
