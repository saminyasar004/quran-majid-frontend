"use client";

import Link from "next/link";
import Image from "next/image";
import { Search, Sun, Moon, Heart } from "lucide-react";
import { useState } from "react";
import { SearchDialog } from "./SearchDialog";

interface Props {
  theme: "light" | "dark";
  onToggleTheme: () => void;
}

export function Header({ theme, onToggleTheme }: Props) {
  const [searchOpen, setSearchOpen] = useState(false);
  return (
    <header className="sticky top-0 z-40 bg-background border-b border-border/50">
      <div className="flex items-center justify-between px-4 h-16">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center shadow-md shadow-primary/30 group-hover:opacity-90 transition-opacity shrink-0">
            <Image
              src="/quran-majid-logo.svg"
              alt="Quran Majid Logo"
              width={24}
              height={24}
              className="w-6 h-6 object-contain brightness-0 invert"
            />
          </div>
          <div className="hidden sm:block leading-tight">
            <div className="font-bold text-base tracking-tight">Quran Mazid</div>
            <div className="text-[10px] text-muted-foreground uppercase tracking-widest font-medium">Read, Study, and Learn The Quran</div>
          </div>
        </Link>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setSearchOpen(true)}
            className="w-10 h-10 rounded-full text-muted-foreground hover:text-primary hover:bg-primary/10 flex items-center justify-center transition-all"
            aria-label="Search"
          >
            <Search className="w-5 h-5" />
          </button>
          <button
            onClick={onToggleTheme}
            className="w-10 h-10 rounded-full text-muted-foreground hover:text-primary hover:bg-primary/10 flex items-center justify-center transition-all"
            aria-label="Toggle theme"
          >
            {theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
          <button className="ml-2 inline-flex items-center gap-2 bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/20 transition-all px-5 h-10 rounded-full text-sm font-semibold">
            <span>Support Us</span>
            <Heart className="w-4 h-4 fill-current" />
          </button>
        </div>
      </div>
      <SearchDialog open={searchOpen} onClose={() => setSearchOpen(false)} />
    </header>
  );
}
