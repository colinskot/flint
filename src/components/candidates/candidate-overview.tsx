"use client";

import type { ReactNode } from "react";
import type { Candidate } from "@/lib/types";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Phone, Mail, MapPin, ChevronDown, CircleHelp, Copy } from "lucide-react";
import { toast } from "sonner";

function initials(first: string, last: string) {
  return `${first.slice(0, 1)}${last.slice(0, 1)}`.toUpperCase();
}

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

export function CandidateOverview({
  candidate,
  actions,
}: {
  candidate: Candidate;
  actions?: ReactNode;
}) {
  const copyText = async (label: string, text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success(`${label} copied`);
    } catch {
      toast.error("Could not copy");
    }
  };

  return (
    <section className="shrink-0 px-4 py-4 md:px-5 md:py-5">
      <div className="flex flex-wrap items-start gap-4">
        <Avatar className="size-14 border-2 border-border md:size-16">
          <AvatarFallback className="bg-accent text-base font-semibold text-accent-foreground">
            {initials(candidate.firstName, candidate.lastName)}
          </AvatarFallback>
        </Avatar>
        <div className="min-w-0 flex-1 space-y-3">
          <div className="flex flex-wrap items-center gap-2 gap-y-1">
            <h2 className="text-lg font-semibold tracking-tight text-foreground md:text-xl">
              {candidate.firstName} {candidate.lastName}
            </h2>
            <Badge variant={statusVariant[candidate.status]} className="text-[10px] uppercase">
              {statusLabel[candidate.status]}
            </Badge>
            <Badge variant="outline" className="text-[10px]">
              {candidate.specialty}
            </Badge>
            <span className="ms-auto flex shrink-0 flex-wrap items-center justify-end gap-1.5">
              {actions}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="h-8 gap-1 rounded-xl px-2.5 text-xs md:h-9 md:px-3 md:text-sm"
                  >
                    Contact
                    <ChevronDown className="size-3.5 opacity-60" aria-hidden />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>Reach out</DropdownMenuLabel>
                  <DropdownMenuItem asChild>
                    <a href={`tel:${candidate.phoneE164}`} className="gap-2">
                      <Phone className="size-3.5" aria-hidden />
                      {candidate.phoneDisplay}
                    </a>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <a href={`mailto:${candidate.email}`} className="gap-2">
                      <Mail className="size-3.5" aria-hidden />
                      <span className="truncate">{candidate.email}</span>
                    </a>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => {
                      void copyText("Phone", candidate.phoneDisplay);
                    }}
                  >
                    <Copy className="size-3.5" aria-hidden />
                    Copy phone
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => {
                      void copyText("Email", candidate.email);
                    }}
                  >
                    <Copy className="size-3.5" aria-hidden />
                    Copy email
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <Dialog>
                <DialogTrigger asChild>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    className="rounded-xl text-muted-foreground hover:text-foreground"
                    aria-label="About this workspace"
                  >
                    <CircleHelp className="size-4" aria-hidden />
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>Demo workspace</DialogTitle>
                    <DialogDescription>
                      Synthetic nurse lead — open Copilot for mocked recruiter insights, use Activity for the timeline,
                      then send from the composer. Nothing is sent to real carriers or SMTP.
                    </DialogDescription>
                  </DialogHeader>
                  <p className="text-xs text-muted-foreground">
                    Data is non-PHI; API routes use deterministic fallbacks unless you add keys as described in the
                    README.
                  </p>
                </DialogContent>
              </Dialog>
            </span>
          </div>
          <div className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-foreground">
            <span className="inline-flex items-center gap-1.5">
              <MapPin className="size-3.5 shrink-0 text-muted-foreground" aria-hidden />
              {candidate.licenseState}
            </span>
            <span className="inline-flex items-center gap-1.5 text-muted-foreground">
              <span className="sr-only">Timezone</span>
              {candidate.timezone.replaceAll("_", " ")}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
