"use client";

import { Home, LayoutGrid, Compass, Clock, User, Settings } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function VerticalNavbar() {
  const pathname = usePathname();

  const items = [
    { icon: Home, href: "/", label: "Home" },
    { icon: LayoutGrid, href: "/surah/1", label: "Surahs" },
    { icon: Compass, href: "/explore", label: "Explore" },
    { icon: Clock, href: "/history", label: "History" },
    { icon: User, href: "/profile", label: "Profile" },
  ];

  return (
    <nav className="hidden md:flex flex-col items-center py-6 w-16 bg-background border-r border-border/50 shrink-0 h-full">
      <div className="space-y-8">
        {items.map((item) => {
          const active = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
          return (
            <Link
              key={item.label}
              href={item.href}
              className={`flex flex-col items-center gap-1 group transition-colors ${
                active ? "text-primary" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <div className={`p-2 rounded-xl transition-all ${active ? "bg-primary/10 shadow-sm" : "group-hover:bg-muted"}`}>
                <item.icon className={`w-5 h-5 ${active ? "stroke-[2.5px]" : "stroke-[1.5px]"}`} />
              </div>
            </Link>
          );
        })}
      </div>
      
      <div className="mt-auto">
        <button className="p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
          <Settings className="w-5 h-5" />
        </button>
      </div>
    </nav>
  );
}
