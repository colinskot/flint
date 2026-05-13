"use client";

import { DEMO_NOW_MS } from "@/data/seed";
import { DEFAULT_CANDIDATES_LIST_CRITERIA, filterSortCandidates } from "@/lib/candidates-query";
import { usePortal } from "@/context/portal-context";
import type { TimelineMessage } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemo, useState } from "react";

const statusLabel = {
  new: "New",
  active: "Active",
  waiting: "Waiting",
} as const;

const statusVariant = {
  new: "secondary" as const,
  active: "default" as const,
  waiting: "outline" as const,
};

function initials(first: string, last: string) {
  return `${first.slice(0, 1)}${last.slice(0, 1)}`.toUpperCase();
}

function formatRelativeDemo(iso: string) {
  const diffMs = DEMO_NOW_MS - new Date(iso).getTime();
  const h = Math.floor(diffMs / (1000 * 60 * 60));
  if (h < 24) return `${String(Math.max(1, h))}h ago`;
  const days = Math.floor(h / 24);
  return `${String(days)}d ago`;
}

function lastMessagePreview(last: TimelineMessage) {
  const text =
    [last.subject, last.body, last.disposition].find(
      (v) => typeof v === "string" && v.trim().length > 0,
    ) ?? "Call";
  return `${last.kind.toUpperCase()} · ${text}`;
}

export function CandidateSidebar({ className }: { className?: string }) {
  const pathname = usePathname();
  const [q, setQ] = useState("");
  const { messagesFor } = usePortal();

  const filtered = useMemo(
    () => filterSortCandidates({ ...DEFAULT_CANDIDATES_LIST_CRITERIA, query: q }),
    [q],
  );

  return (
    <div
      className={cn(
        "flex min-h-0 flex-col overflow-hidden border-r border-border bg-sidebar",
        className,
      )}
    >
      <div className="p-4 pb-3">
        <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
          Candidates
        </p>
        <Input
          value={q}
          onChange={(e) => { setQ(e.target.value); }}
          placeholder="Search name, license, specialty…"
          aria-label="Search candidates"
          className="mt-3 rounded-xl border-border bg-card"
        />
      </div>
      <ScrollArea className="min-h-0 flex-1 px-3">
        <ul className="space-y-1 pb-4">
          {filtered.map((c) => {
            const active = pathname === `/candidates/${c.id}`;
            const last = messagesFor(c.id).at(-1);

            return (
              <li key={c.id}>
                <Link
                  href={`/candidates/${c.id}`}
                  className={cn(
                    "flex items-start gap-3 rounded-2xl px-3 py-2.5 text-left transition-colors outline-none hover:bg-sidebar-accent focus-visible:ring-2 focus-visible:ring-ring",
                    active && "bg-sidebar-accent shadow-sm",
                  )}
                >
                  <Avatar className="mt-0.5 size-9 border border-border">
                    <AvatarFallback className="bg-accent text-accent-foreground text-xs font-semibold">
                      {initials(c.firstName, c.lastName)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0 flex-1 space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="truncate font-medium text-sidebar-foreground">
                        {c.firstName} {c.lastName}
                      </span>
                      <Badge variant={statusVariant[c.status]} className="shrink-0 text-[10px]">
                        {statusLabel[c.status]}
                      </Badge>
                    </div>
                    <p className="truncate text-xs text-muted-foreground">
                      {c.specialty} · {c.licenseState}
                    </p>
                    <p className="truncate text-xs text-muted-foreground">
                      {last ? lastMessagePreview(last) : "No thread yet"}
                    </p>
                    <p className="text-[10px] text-muted-foreground">
                      Updated {formatRelativeDemo(c.lastTouchAt)}
                    </p>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      </ScrollArea>
    </div>
  );
}
