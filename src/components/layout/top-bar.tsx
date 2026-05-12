"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { CandidateSidebar } from "@/components/candidates/candidate-sidebar";
import { usePortal } from "@/context/portal-context";
import Link from "next/link";

export function TopBar() {
  const { resetDemo } = usePortal();

  return (
    <header className="flex shrink-0 items-center justify-between gap-3 border-b border-border bg-card px-4 py-2 md:gap-4 md:px-6 md:py-3">
      <div className="flex min-w-0 items-center gap-3 md:gap-4">
        <Sheet>
          <SheetTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="shrink-0 rounded-xl md:hidden"
              aria-label="Open candidates"
            >
              <Menu className="size-5" aria-hidden />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[min(100%,20rem)] p-0">
            <SheetHeader className="sr-only">
              <SheetTitle>Candidates</SheetTitle>
            </SheetHeader>
            <CandidateSidebar className="h-full border-0" />
          </SheetContent>
        </Sheet>

        <Link href="/candidates/cand-01" className="flex min-w-0 items-center gap-3">
          <Image
            src="/branding/logo-mark.png"
            alt="Flint"
            width={120}
            height={40}
            className="h-9 w-auto object-contain"
            priority
          />
          <div className="hidden min-w-0 sm:block">
            <p className="truncate text-sm font-semibold text-foreground">
              Recruiter communication
            </p>
            <p className="truncate text-xs text-muted-foreground">
              SMS · Email · Call (Phase 1 demo)
            </p>
          </div>
        </Link>
      </div>

      <div className="flex shrink-0 items-center gap-2">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="rounded-xl text-xs text-muted-foreground"
          onClick={() => {
            resetDemo();
          }}
        >
          Reset demo data
        </Button>
      </div>
    </header>
  );
}
