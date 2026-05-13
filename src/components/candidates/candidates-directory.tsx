"use client";

import { DEMO_NOW_MS, SEED_CANDIDATES } from "@/data/seed";
import { filterSortCandidates } from "@/lib/candidates-query";
import { usePortal } from "@/context/portal-context";
import type { TimelineMessage } from "@/lib/types";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { useMemo, useState } from "react";
import { ArrowRight, MessagesSquare } from "lucide-react";

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

function lastPreview(last: TimelineMessage | undefined): string {
  if (!last) return "No conversation yet — open to start.";
  const raw =
    [last.subject, last.body, last.disposition].find(
      (v) => typeof v === "string" && v.trim().length > 0,
    ) ?? "Call logged";
  const short = raw.length > 96 ? `${raw.slice(0, 96)}…` : raw;
  return `${last.kind.toUpperCase()} · ${short}`;
}

export function CandidatesDirectory() {
  const [q, setQ] = useState("");
  const { messagesFor } = usePortal();
  const filtered = useMemo(() => filterSortCandidates(q), [q]);

  return (
    <div className="min-h-0 flex-1 overflow-y-auto bg-[var(--canvas)]">
      <div className="mx-auto max-w-5xl px-4 py-6 md:px-8 md:py-8">
        <div className="mb-6 md:mb-8">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Recruiter workspace
          </p>
          <h1 className="mt-2 text-2xl font-semibold tracking-tight text-foreground md:text-3xl">
            Candidates
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
            Pick a nurse lead to review their profile, run mocked AI helpers, then jump into SMS, email,
            or call logging. Showing {filtered.length} of {SEED_CANDIDATES.length} seeded profiles (synthetic demo
            data only).
          </p>
          <Input
            value={q}
            onChange={(e) => { setQ(e.target.value); }}
            placeholder="Filter by name, specialty, license, email…"
            aria-label="Filter candidates"
            className="mt-5 max-w-lg rounded-xl border-border bg-card"
          />
        </div>

        <ul className="grid gap-3 sm:grid-cols-2 lg:gap-4 xl:grid-cols-2">
          {filtered.map((c) => {
            const last = messagesFor(c.id).at(-1);
            return (
              <li key={c.id}>
                <Link
                  href={`/candidates/${c.id}`}
                  aria-label={`Open workspace for ${c.firstName} ${c.lastName}`}
                  className="group block h-full rounded-xl outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                  <Card className="h-full cursor-pointer border-border p-4 shadow-sm transition-shadow group-hover:shadow-md md:p-5">
                    <div className="flex gap-4">
                      <Avatar className="size-11 shrink-0 border border-border">
                        <AvatarFallback className="bg-accent text-[11px] font-semibold text-accent-foreground">
                          {initials(c.firstName, c.lastName)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="min-w-0 flex-1 space-y-2">
                        <div className="flex items-start gap-2">
                          <div className="flex min-w-0 flex-1 flex-wrap items-center gap-2">
                            <p className="truncate font-semibold text-foreground">
                              {c.firstName} {c.lastName}
                            </p>
                            <Badge variant={statusVariant[c.status]} className="text-[10px]">
                              {statusLabel[c.status]}
                            </Badge>
                          </div>
                          <ArrowRight
                            className="mt-0.5 size-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-foreground"
                            aria-hidden
                          />
                        </div>
                        <p className="text-xs font-medium text-foreground">
                          {c.specialty} · {c.licenseState}
                        </p>
                        <div className="flex items-start gap-1.5 text-[11px] leading-snug text-muted-foreground">
                          <MessagesSquare className="mt-0.5 size-3.5 shrink-0" aria-hidden />
                          <span className="line-clamp-2">{lastPreview(last)}</span>
                        </div>
                        <p className="text-[10px] text-muted-foreground">
                          Updated {formatRelativeDemo(c.lastTouchAt)}
                        </p>
                      </div>
                    </div>
                  </Card>
                </Link>
              </li>
            );
          })}
        </ul>

        {filtered.length === 0 && (
          <p className="mt-6 text-center text-sm text-muted-foreground">
            No matches — try a different keyword.
          </p>
        )}
      </div>
    </div>
  );
}
