"use client";

import { useEffect, useState } from "react";
import { Search, RotateCcw, Gauge, Users, Check, MessageSquare, Settings2 } from "lucide-react";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { usePlayer } from "@/hooks/use-player";
import { fetchReciters, type Reciter } from "@/lib/quran-api";

interface Props {
  open: boolean;
  onClose: () => void;
}

type Tab = "Repeat" | "Playback Speed" | "Reciter";

export function AudioSettingsModal({ open, onClose }: Props) {
  const { 
    reciter: currentReciter, 
    setReciter, 
    playbackSpeed, 
    setPlaybackSpeed, 
    repeat, 
    setRepeat 
  } = usePlayer();

  const [tab, setTab] = useState<Tab>("Playback Speed");
  const [reciters, setReciters] = useState<Reciter[]>([]);
  const [search, setSearch] = useState("");
  const [tempReciter, setTempReciter] = useState(currentReciter);
  const [tempSpeed, setTempSpeed] = useState(playbackSpeed);
  const [tempRepeat, setTempRepeat] = useState(repeat);

  useEffect(() => {
    if (open) {
      fetchReciters().then(setReciters).catch(console.error);
      setTempReciter(currentReciter);
      setTempSpeed(playbackSpeed);
      setTempRepeat(repeat);
    }
  }, [open, currentReciter, playbackSpeed, repeat]);

  const filteredReciters = reciters.filter(r => 
    r.englishName.toLowerCase().includes(search.toLowerCase()) ||
    r.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleSave = () => {
    setReciter(tempReciter);
    setPlaybackSpeed(tempSpeed);
    setRepeat(tempRepeat);
    onClose();
  };

  const speeds = [0.25, 0.5, 0.75, 1, 1.25, 1.5];

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl p-0 overflow-hidden border-none bg-background shadow-2xl rounded-2xl">
        {/* Accessibility Requirements */}
        <div className="sr-only">
          <DialogTitle>Audio Settings</DialogTitle>
          <DialogDescription>
            Configure playback options including repeat, speed, and reciter selection.
          </DialogDescription>
        </div>

        <div className="flex h-[480px]">
          {/* Sidebar */}
          <div className="w-[200px] border-r border-white/5 p-4 bg-muted/30">
            <div className="flex items-center gap-2 mb-8 px-2">
              <Settings2 className="w-4 h-4 text-primary" />
              <h2 className="text-sm font-medium text-muted-foreground">Audio Settings</h2>
            </div>
            
            <nav className="space-y-1">
              <SidebarItem 
                icon={<MessageSquare className="w-4 h-4" />} 
                label="Repeat" 
                active={tab === "Repeat"} 
                onClick={() => setTab("Repeat")} 
              />
              <SidebarItem 
                icon={<Gauge className="w-4 h-4" />} 
                label="Playback Speed" 
                active={tab === "Playback Speed"} 
                onClick={() => setTab("Playback Speed")} 
              />
              <SidebarItem 
                icon={<Users className="w-4 h-4" />} 
                label="Reciter" 
                active={tab === "Reciter"} 
                onClick={() => setTab("Reciter")} 
              />
            </nav>
          </div>

          {/* Main Content Area */}
          <div className="flex-1 flex flex-col min-w-0 bg-background">
            <div className="p-6 pb-2 text-center border-b border-white/5">
              <h3 className="text-sm font-bold text-foreground">Manage {tab}</h3>
            </div>

            <div className="flex-1 p-6 min-h-0">
              {tab === "Reciter" && (
                <div className="h-full flex flex-col gap-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input 
                      placeholder="Search Reciter..." 
                      className="pl-10 h-10 bg-muted/30 border-none text-foreground focus-visible:ring-1 focus-visible:ring-primary placeholder:text-muted-foreground/50"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                    />
                  </div>
                  <ScrollArea className="flex-1 -mr-4 pr-4">
                    <div className="space-y-0.5">
                      {filteredReciters.map((r) => (
                        <button
                          key={r.identifier}
                          onClick={() => setTempReciter(r.identifier)}
                          className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition-colors ${
                            tempReciter === r.identifier 
                              ? "bg-primary/10 text-primary" 
                              : "hover:bg-muted/50 text-muted-foreground hover:text-gray-200"
                          }`}
                        >
                          <span className="text-sm font-medium">{r.englishName}</span>
                          {tempReciter === r.identifier && <Check className="w-4 h-4" />}
                        </button>
                      ))}
                    </div>
                  </ScrollArea>
                </div>
              )}

              {tab === "Playback Speed" && (
                <ScrollArea className="h-full -mr-4 pr-4">
                  <div className="space-y-1">
                    {speeds.map((s) => (
                      <button
                        key={s}
                        onClick={() => setTempSpeed(s)}
                        className={`w-full flex items-center justify-between px-3 py-3 rounded-lg transition-colors ${
                          tempSpeed === s 
                            ? "bg-primary/10 text-primary" 
                            : "hover:bg-muted/50 text-muted-foreground hover:text-gray-200"
                        }`}
                      >
                        <span className="text-sm font-medium">{s}x</span>
                        {tempSpeed === s && <Check className="w-4 h-4" />}
                      </button>
                    ))}
                  </div>
                </ScrollArea>
              )}

              {tab === "Repeat" && (
                <div className="h-full flex flex-col items-center justify-center gap-6">
                  <div className={`w-16 h-16 rounded-full flex items-center justify-center ${tempRepeat ? "bg-primary/20 text-primary" : "bg-muted text-muted-foreground"}`}>
                    <RotateCcw className="w-8 h-8" />
                  </div>
                  <div className="text-center space-y-1">
                    <h4 className="text-sm font-bold text-foreground">Repeat Ayah</h4>
                    <p className="text-xs text-muted-foreground">Enable to loop the current verse</p>
                  </div>
                  <Button 
                    variant="ghost"
                    onClick={() => setTempRepeat(!tempRepeat)}
                    className={`rounded-full px-8 h-9 text-xs border ${tempRepeat ? "border-primary text-primary bg-primary/10" : "border-white/10 text-muted-foreground"}`}
                  >
                    {tempRepeat ? "Enabled" : "Disabled"}
                  </Button>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="flex border-t border-white/5 h-16">
              <button 
                onClick={onClose} 
                className="flex-1 h-full font-bold text-sm text-muted-foreground hover:bg-muted/50 transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={handleSave} 
                className="flex-1 h-full bg-primary text-primary-foreground font-bold text-sm hover:opacity-90 transition-opacity"
              >
                Save & Play
              </button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function SidebarItem({ icon, label, active, onClick }: { icon: React.ReactNode, label: string, active: boolean, onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg transition-colors text-sm font-medium ${
        active 
          ? "bg-white/5 text-foreground" 
          : "text-muted-foreground hover:text-gray-300 hover:bg-white/5"
      }`}
    >
      {icon}
      <span>{label}</span>
    </button>
  );
}
