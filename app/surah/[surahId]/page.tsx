"use client";

import { useParams, notFound } from "next/navigation";
import { useState } from "react";
import { Header } from "@/components/quran/Header";
import { SurahSidebar } from "@/components/quran/SurahSidebar";
import { SettingsPanel } from "@/components/quran/SettingsPanel";
import { AyahList } from "@/components/quran/AyahList";
import { useSettings } from "@/hooks/use-settings";
import { VerticalNavbar } from "@/components/quran/VerticalNavbar";
import { Menu, Settings as SettingsIcon, X } from "lucide-react";

export default function SurahPage() {
  const params = useParams() as { surahId: string };
  const surahId = params.surahId;
  const n = Number(surahId);
  
  if (!Number.isInteger(n) || n < 1 || n > 114) {
    notFound();
  }

  const { settings, update } = useSettings();
  const [leftOpen, setLeftOpen] = useState(false);
  const [rightOpen, setRightOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Far Left: Vertical Navbar */}
      <VerticalNavbar />

      <div className="flex-1 flex flex-col min-w-0 h-full">
        <Header
          theme={settings.theme}
          onToggleTheme={() => update("theme", settings.theme === "dark" ? "light" : "dark")}
        />

        <div className="flex-1 flex overflow-hidden p-4 gap-4">
          {/* Left Column: Sidebar */}
          <div className="hidden lg:block w-[320px] shrink-0 h-full overflow-hidden">
            <SurahSidebar />
          </div>

          {/* Center Column: Main Content */}
          <main className="flex-1 min-w-0 bg-card rounded-2xl border border-border/50 flex flex-col h-full overflow-hidden">
            <div className="flex items-center justify-between lg:hidden p-4 pb-0">
              <button onClick={() => setLeftOpen(true)} className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                <Menu className="w-5 h-5" />
              </button>
              <button onClick={() => setRightOpen(true)} className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                <SettingsIcon className="w-5 h-5" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto custom-scrollbar px-4 md:px-8 py-2">
              <AyahList surahNumber={Number(surahId)} settings={settings} />
            </div>
          </main>

          {/* Right Column: Settings Panel */}
          <div className="hidden lg:block w-[340px] shrink-0 h-full overflow-hidden">
            <SettingsPanel settings={settings} update={update} />
          </div>
        </div>
      </div>

      {/* Mobile drawers */}
      {leftOpen && (
        <Drawer side="left" onClose={() => setLeftOpen(false)}>
          <SurahSidebar />
        </Drawer>
      )}
      {rightOpen && (
        <Drawer side="right" onClose={() => setRightOpen(false)}>
          <SettingsPanel settings={settings} update={update} />
        </Drawer>
      )}
    </div>
  );
}

function Drawer({ side, onClose, children }: { side: "left" | "right"; onClose: () => void; children: React.ReactNode }) {
  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm lg:hidden animate-in fade-in duration-300" onClick={onClose}>
      <div
        className={`absolute top-0 ${side === "left" ? "left-0 animate-in slide-in-from-left" : "right-0 animate-in slide-in-from-right"} h-full w-[85%] max-w-[320px] bg-card border-${side === "left" ? "r" : "l"} border-border/30 p-4 shadow-2xl flex flex-col duration-300`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <span className="text-xs font-black uppercase tracking-widest text-muted-foreground/60 px-2">
            {side === "left" ? "Surah List" : "Settings"}
          </span>
          <button 
            onClick={onClose} 
            className="w-10 h-10 rounded-full bg-muted/50 hover:bg-muted flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="flex-1 overflow-hidden">
          {children}
        </div>
      </div>
    </div>
  );
}
