"use client";

import { PortalProvider } from "@/context/portal-context";
import { SEED_TIMELINE } from "@/data/seed";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/sonner";

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <PortalProvider seedTimeline={SEED_TIMELINE}>
      <TooltipProvider delayDuration={200}>
        {children}
        <Toaster position="top-center" richColors closeButton />
      </TooltipProvider>
    </PortalProvider>
  );
}
