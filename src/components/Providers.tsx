"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { PlayerProvider } from "@/hooks/use-player";
import { useState } from "react";

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <PlayerProvider>
        {children}
      </PlayerProvider>
    </QueryClientProvider>
  );
}
