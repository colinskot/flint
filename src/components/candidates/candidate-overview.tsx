import type { Candidate } from "@/lib/types";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Phone, Mail, MapPin } from "lucide-react";

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

export function CandidateOverview({ candidate }: { candidate: Candidate }) {
  return (
    <Card className="border-border px-4 py-4 shadow-sm md:px-5 md:py-5">
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
          <Separator />
          <div className="grid gap-2 text-sm sm:grid-cols-2">
            <a
              href={`tel:${candidate.phoneE164}`}
              className="inline-flex items-center gap-2 text-foreground underline-offset-4 hover:underline"
            >
              <Phone className="size-4 shrink-0 text-muted-foreground" aria-hidden />
              {candidate.phoneDisplay}
            </a>
            <a
              href={`mailto:${candidate.email}`}
              className="inline-flex min-w-0 items-center gap-2 text-foreground underline-offset-4 hover:underline"
            >
              <Mail className="size-4 shrink-0 text-muted-foreground" aria-hidden />
              <span className="truncate">{candidate.email}</span>
            </a>
          </div>
          <p className="text-xs leading-snug text-muted-foreground">
            Primary record for this nurse lead. Use <strong className="font-medium text-foreground">AI copilot</strong>{" "}
            for mocked insights, then <strong className="font-medium text-foreground">Activity</strong> for the message
            timeline and the composer to send (demo only).
          </p>
        </div>
      </div>
    </Card>
  );
}
