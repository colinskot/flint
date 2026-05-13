"use client";

import { CandidateSidebar } from "@/components/candidates/candidate-sidebar";
import { usePathname } from "next/navigation";

function isCandidatesIndex(pathname: string) {
  return pathname === "/candidates" || pathname === "/candidates/";
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const hideSidebar = isCandidatesIndex(pathname);

  return (
    <div className="flex min-h-0 flex-1">
      {!hideSidebar && (
        <CandidateSidebar className="hidden w-[min(100%,20rem)] shrink-0 md:flex lg:w-[22rem]" />
      )}
      <div className="flex min-h-0 min-w-0 flex-1 flex-col">{children}</div>
    </div>
  );
}
