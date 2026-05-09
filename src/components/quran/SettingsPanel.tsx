"use client";

import { ChevronDown, Heart, BookOpen, Type, ChevronLeft, ChevronRight, Check } from "lucide-react";
import { useState } from "react";
import type { QuranSettings } from "@/hooks/use-settings";
import { TRANSLATION_NAME } from "@/lib/quran-api";

interface Props {
  settings: QuranSettings;
  update: <K extends keyof QuranSettings>(k: K, v: QuranSettings[K]) => void;
}

const FONTS = [
  "Amiri (Classic)",
  "Scheherazade (Modern)",
  "Noto Naskh (Clean)",
];

export function SettingsPanel({ settings, update }: Props) {
  const [readingOpen, setReadingOpen] = useState(false);
  const [fontOpen, setFontOpen] = useState(true);
  const [mode, setMode] = useState<"Translation" | "Reading">("Translation");
  const [view, setView] = useState<"main" | "font">("main");
  const [fontTab, setFontTab] = useState<"Uthmani" | "Indopak">("Uthmani");

  if (view === "font") {
    return (
      <aside className="bg-card rounded-2xl border border-border/50 p-4 h-full flex flex-col overflow-hidden">
        <div className="flex items-center gap-3 mb-6">
          <button
            onClick={() => setView("main")}
            className="w-8 h-8 rounded-full hover:bg-muted flex items-center justify-center transition-colors"
          >
            <ChevronLeft className="w-5 h-5 text-primary" />
          </button>
          <h2 className="text-sm font-bold text-foreground/90">Select Font Face</h2>
        </div>

        <div className="grid grid-cols-2 bg-muted/30 rounded-xl p-1 text-xs font-bold mb-6">
          {(["Uthmani", "Indopak"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setFontTab(t)}
              className={`h-8 rounded-lg transition-all duration-200 ${
                fontTab === t
                  ? "bg-card shadow-sm text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar pr-1 space-y-1">
          {FONTS.map((f) => (
            <button
              key={f}
              onClick={() => {
                update("arabicFontFace", f);
                setView("main");
              }}
              className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-muted/50 transition-colors group"
            >
              <span
                className={`text-sm font-semibold ${settings.arabicFontFace === f ? "text-primary" : "text-muted-foreground/80 group-hover:text-foreground"}`}
              >
                {f}
              </span>
              {settings.arabicFontFace === f && <Check className="w-4 h-4 text-primary" />}
            </button>
          ))}
        </div>
      </aside>
    );
  }

  return (
    <aside className="bg-card rounded-2xl border border-border/50 p-4 h-full flex flex-col overflow-hidden custom-scrollbar">
      <div className="grid grid-cols-2 bg-muted/30 rounded-full p-1 text-sm font-semibold mb-6">
        {(["Translation", "Reading"] as const).map((m) => (
          <button
            key={m}
            onClick={() => {
              setMode(m);
              update("showTranslation", m === "Translation");
            }}
            className={`h-9 rounded-full transition-all duration-200 ${
              mode === m
                ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {m}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto pr-1 space-y-4">
        <Section
          title="Reading Settings"
          icon={<BookOpen className="w-4 h-4" />}
          open={readingOpen}
          onToggle={() => setReadingOpen((o) => !o)}
        >
          <label className="block text-[10px] uppercase tracking-widest font-bold text-muted-foreground mb-2">
            Translation
          </label>
          <select
            value={settings.translation}
            onChange={(e) => update("translation", e.target.value)}
            className="w-full bg-muted/50 border border-border/30 rounded-xl h-11 px-4 text-sm outline-none focus:ring-2 focus:ring-primary/30 transition-all cursor-pointer"
          >
            {Object.entries(TRANSLATION_NAME).map(([k, v]) => (
              <option key={k} value={k}>
                {v}
              </option>
            ))}
          </select>
        </Section>

        <Section
          title="Font Settings"
          icon={<Type className="w-4 h-4" />}
          open={fontOpen}
          onToggle={() => setFontOpen((o) => !o)}
        >
          <Slider
            label="Arabic Font Size"
            value={settings.arabicFontSize}
            min={18}
            max={60}
            onChange={(v) => update("arabicFontSize", v)}
          />
          <Slider
            label="Translation Font Size"
            value={settings.translationFontSize}
            min={12}
            max={32}
            onChange={(v) => update("translationFontSize", v)}
          />
          <div className="mt-6">
            <div className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground mb-2">
              Arabic Font Face
            </div>
            <button
              onClick={() => setView("font")}
              className="w-full flex items-center justify-between bg-muted/50 border border-border/30 rounded-xl h-11 px-4 text-sm font-bold text-foreground/90 hover:bg-muted transition-all group"
            >
              <span>{settings.arabicFontFace}</span>
              <ChevronRight className="w-4 h-4 text-muted-foreground/60 group-hover:text-primary transition-colors" />
            </button>
          </div>
        </Section>

        <div className="bg-primary/5 border border-primary/20 rounded-2xl p-5 mt-auto">
          <div className="font-bold text-sm text-primary mb-2 flex items-center gap-2">
            <Heart className="w-4 h-4 fill-current" />
            Support Islam
          </div>
          <p className="text-[11px] leading-relaxed text-muted-foreground mb-4 font-medium">
            Your regular support helps us reach our religious brothers and sisters with the message
            of Islam.
          </p>
          <button className="w-full bg-primary text-primary-foreground rounded-full h-11 text-xs font-bold uppercase tracking-wider hover:bg-primary/90 transition-all shadow-lg shadow-primary/20">
            Support Us
          </button>
        </div>
      </div>
    </aside>
  );
}

function Section({
  title,
  icon,
  open,
  onToggle,
  children,
}: {
  title: string;
  icon: React.ReactNode;
  open: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-surface-muted/40 rounded-xl">
      <button
        onClick={onToggle}
        className="w-full flex items-center gap-2 p-3 text-sm font-semibold"
      >
        <span className="w-7 h-7 rounded-md bg-primary text-primary-foreground flex items-center justify-center">
          {icon}
        </span>
        <span className="flex-1 text-left">{title}</span>
        <ChevronDown className={`w-4 h-4 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && <div className="px-3 pb-3">{children}</div>}
    </div>
  );
}

function Slider({
  label,
  value,
  min,
  max,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  onChange: (v: number) => void;
}) {
  return (
    <div className="mb-3">
      <div className="flex justify-between text-xs font-medium mb-2">
        <span>{label}</span>
        <span className="text-primary">{value}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full accent-primary bg-background"
      />
    </div>
  );
}
