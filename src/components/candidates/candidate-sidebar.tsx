"use client";

import { DEMO_NOW_MS } from "@/data/seed";
import {
  candidatesFilterOptions,
  CANDIDATES_SORT_LABELS,
  DEFAULT_CANDIDATES_LIST_CRITERIA,
  filterSortCandidates,
  type CandidatesListSort,
} from "@/lib/candidates-query";
import { usePortal } from "@/context/portal-context";
import type { CandidateStatus, TimelineMessage } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ListFilter } from "lucide-react";
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
  const [status, setStatus] = useState<CandidateStatus | "all">(DEFAULT_CANDIDATES_LIST_CRITERIA.status);
  const [specialty, setSpecialty] = useState<string>(DEFAULT_CANDIDATES_LIST_CRITERIA.specialty);
  const [licenseState, setLicenseState] = useState<string>(
    DEFAULT_CANDIDATES_LIST_CRITERIA.licenseState,
  );
  const [sort, setSort] = useState<CandidatesListSort>(DEFAULT_CANDIDATES_LIST_CRITERIA.sort);
  const [filtersOpen, setFiltersOpen] = useState(false);

  const { specialties, licenseStates } = useMemo(() => candidatesFilterOptions(), []);
  const { messagesFor } = usePortal();

  const activeFilterCount =
    (status !== "all" ? 1 : 0) + (specialty !== "all" ? 1 : 0) + (licenseState !== "all" ? 1 : 0);

  const filtered = useMemo(
    () => filterSortCandidates({ query: q, status, specialty, licenseState, sort }),
    [licenseState, q, sort, specialty, status],
  );

  const resetFilters = () => {
    setStatus(DEFAULT_CANDIDATES_LIST_CRITERIA.status);
    setSpecialty(DEFAULT_CANDIDATES_LIST_CRITERIA.specialty);
    setLicenseState(DEFAULT_CANDIDATES_LIST_CRITERIA.licenseState);
  };

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
          onChange={(e) => {
            setQ(e.target.value);
          }}
          placeholder="Search name, license, specialty…"
          aria-label="Search candidates"
          className="mt-3 rounded-xl border-border bg-card"
        />
        <div className="mt-2 flex gap-2">
          <Select
            value={sort}
            onValueChange={(v) => {
              setSort(v as CandidatesListSort);
            }}
          >
            <SelectTrigger
              size="sm"
              aria-label="Sort candidates"
              className="h-9 min-w-0 flex-1 rounded-xl border-border bg-card px-3 text-xs"
            >
              <SelectValue placeholder="Sort" />
            </SelectTrigger>
            <SelectContent className="min-w-[min(100vw-2rem,18rem)]" position="popper">
              {(Object.keys(CANDIDATES_SORT_LABELS) as CandidatesListSort[]).map((key) => (
                <SelectItem key={key} value={key} className="text-xs">
                  {CANDIDATES_SORT_LABELS[key]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Popover open={filtersOpen} onOpenChange={setFiltersOpen}>
            <PopoverTrigger asChild>
              <Button
                type="button"
                variant="outline"
                size="sm"
                aria-label="Filter candidates"
                className="h-9 shrink-0 gap-1.5 rounded-xl border-border bg-card px-2.5 text-xs"
              >
                <ListFilter className="size-3.5" aria-hidden />
                Filters
                {activeFilterCount > 0 ? (
                  <Badge
                    variant="secondary"
                    className="h-5 min-w-5 justify-center rounded-md px-1 text-[10px] tabular-nums"
                  >
                    {activeFilterCount}
                  </Badge>
                ) : null}
              </Button>
            </PopoverTrigger>
            <PopoverContent align="start" className="w-72 space-y-3 p-4">
              <div className="space-y-1.5">
                <Label htmlFor="sidebar-cand-filter-status" className="text-xs text-muted-foreground">
                  Status
                </Label>
                <Select
                  value={status}
                  onValueChange={(v) => {
                    setStatus(v as CandidateStatus | "all");
                  }}
                >
                  <SelectTrigger id="sidebar-cand-filter-status" size="sm" className="w-full rounded-xl bg-card">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent position="popper">
                    <SelectItem value="all">All statuses</SelectItem>
                    <SelectItem value="new">{statusLabel.new}</SelectItem>
                    <SelectItem value="active">{statusLabel.active}</SelectItem>
                    <SelectItem value="waiting">{statusLabel.waiting}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="sidebar-cand-filter-specialty" className="text-xs text-muted-foreground">
                  Specialty
                </Label>
                <Select
                  value={specialty}
                  onValueChange={(v) => {
                    setSpecialty(v);
                  }}
                >
                  <SelectTrigger
                    id="sidebar-cand-filter-specialty"
                    size="sm"
                    className="w-full rounded-xl bg-card"
                  >
                    <SelectValue placeholder="Specialty" />
                  </SelectTrigger>
                  <SelectContent position="popper">
                    <SelectItem value="all">All specialties</SelectItem>
                    {specialties.map((s) => (
                      <SelectItem key={s} value={s}>
                        {s}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="sidebar-cand-filter-license" className="text-xs text-muted-foreground">
                  License state
                </Label>
                <Select
                  value={licenseState}
                  onValueChange={(v) => {
                    setLicenseState(v);
                  }}
                >
                  <SelectTrigger
                    id="sidebar-cand-filter-license"
                    size="sm"
                    className="w-full rounded-xl bg-card"
                  >
                    <SelectValue placeholder="License" />
                  </SelectTrigger>
                  <SelectContent position="popper">
                    <SelectItem value="all">All license states</SelectItem>
                    {licenseStates.map((ls) => (
                      <SelectItem key={ls} value={ls}>
                        {ls}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex gap-2 pt-1">
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  className="h-8 flex-1 rounded-xl text-xs"
                  disabled={activeFilterCount === 0}
                  onClick={() => {
                    resetFilters();
                  }}
                >
                  Clear filters
                </Button>
                <Button
                  type="button"
                  size="sm"
                  className="h-8 flex-1 rounded-xl text-xs"
                  onClick={() => {
                    setFiltersOpen(false);
                  }}
                >
                  Done
                </Button>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>
      <ScrollArea className="min-h-0 flex-1 px-3">
        <ul className="space-y-1 pb-4">
          {filtered.length === 0 ? (
            <li className="px-3 py-6 text-center text-xs text-muted-foreground">
              No candidates match your search and filters.
            </li>
          ) : (
            filtered.map((c) => {
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
            })
          )}
        </ul>
      </ScrollArea>
    </div>
  );
}
