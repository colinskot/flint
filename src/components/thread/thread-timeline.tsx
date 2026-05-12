"use client";

import type { Candidate, TimelineMessage } from "@/lib/types";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { Phone, Mail, MessageSquare, ArrowDownLeft, ArrowUpRight } from "lucide-react";
import { formatInstantUtc } from "@/lib/format-time";

function KindGlyph({
  kind,
  className,
}: {
  kind: TimelineMessage["kind"];
  className?: string;
}) {
  switch (kind) {
    case "sms":
      return <MessageSquare className={className} aria-hidden />;
    case "email":
      return <Mail className={className} aria-hidden />;
    case "call":
      return <Phone className={className} aria-hidden />;
    default: {
      const _n: never = kind;
      return _n;
    }
  }
}

function MessageBubble({
  message,
}: {
  message: TimelineMessage;
}) {
  const outbound = message.direction === "outbound";

  if (message.kind === "call") {
    return (
      <div
        className={cn(
          "flex w-full",
          outbound ? "justify-end" : "justify-start",
        )}
      >
        <Card
          className={cn(
            "max-w-[min(100%,28rem)] rounded-2xl border px-4 py-3 shadow-sm",
            outbound
              ? "border-primary/20 bg-primary text-primary-foreground"
              : "border-border bg-card",
          )}
        >
          <div className="flex items-center gap-2 text-xs font-medium opacity-90">
            <KindGlyph kind={message.kind} className="size-3.5" />
            <span>Call</span>
            <Badge
              variant="secondary"
              className={cn(
                "text-[10px]",
                outbound && "bg-primary-foreground/15 text-primary-foreground",
              )}
            >
              {message.disposition?.replace("_", " ") ?? "logged"}
            </Badge>
          </div>
          {message.durationSec != null && (
            <p className="mt-1 text-sm opacity-90">
              Duration {Math.floor(message.durationSec / 60)}:
              {String(message.durationSec % 60).padStart(2, "0")}
            </p>
          )}
          {message.callNotes && (
            <p className="mt-2 text-sm leading-relaxed opacity-95">
              {message.callNotes}
            </p>
          )}
          <time
            className="mt-2 block text-[11px] opacity-75"
            dateTime={message.createdAt}
            suppressHydrationWarning
          >
            {formatInstantUtc(message.createdAt)} UTC
          </time>
        </Card>
      </div>
    );
  }

  if (message.kind === "email") {
    return (
      <div className={cn("flex w-full", outbound ? "justify-end" : "justify-start")}>
        <Card
          className={cn(
            "max-w-[min(100%,32rem)] rounded-2xl border px-4 py-3 shadow-sm",
            outbound
              ? "border-primary/20 bg-secondary text-secondary-foreground"
              : "border-border bg-card",
          )}
        >
          <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
            <KindGlyph
              kind={message.kind}
              className="size-3.5 text-foreground/70"
            />
            Email
            {outbound ? (
              <ArrowUpRight className="size-3" aria-label="Outbound" />
            ) : (
              <ArrowDownLeft className="size-3" aria-label="Inbound" />
            )}
          </div>
          {message.subject && (
            <p className="mt-1 font-semibold leading-snug">{message.subject}</p>
          )}
          {message.body && (
            <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed">
              {message.body}
            </p>
          )}
          <time
            className="mt-2 block text-[11px] text-muted-foreground"
            dateTime={message.createdAt}
            suppressHydrationWarning
          >
            {formatInstantUtc(message.createdAt)} UTC
          </time>
        </Card>
      </div>
    );
  }

  /* SMS */
  return (
    <div className={cn("flex w-full", outbound ? "justify-end" : "justify-start")}>
      <div
        className={cn(
          "max-w-[min(100%,22rem)] rounded-2xl px-4 py-2.5 text-sm shadow-sm",
          outbound
            ? "rounded-br-md bg-primary text-primary-foreground"
            : "rounded-bl-md bg-card text-card-foreground ring-1 ring-border",
        )}
      >
        <div className="mb-1 flex items-center gap-1.5 text-[10px] font-medium uppercase tracking-wide opacity-80">
          <KindGlyph kind={message.kind} className="size-3" />
          SMS · {message.direction === "outbound" ? "You" : "Candidate"}
        </div>
        {message.body && (
          <p className="whitespace-pre-wrap leading-relaxed">{message.body}</p>
        )}
        <time
          className="mt-2 block text-[10px] opacity-70"
          dateTime={message.createdAt}
          suppressHydrationWarning
        >
          {formatInstantUtc(message.createdAt)} UTC
        </time>
      </div>
    </div>
  );
}

export function ThreadTimeline({
  candidate,
  messages,
}: {
  candidate: Candidate;
  messages: TimelineMessage[];
}) {
  return (
    <div className="flex flex-1 flex-col overflow-hidden bg-[var(--canvas)]">
      <div className="border-b border-border bg-card px-6 py-4">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          {candidate.firstName} {candidate.lastName}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {candidate.specialty} · {candidate.licenseState} · {candidate.timezone.replaceAll(
            "_",
            " ",
          )}
        </p>
        <p className="mt-2 text-xs text-muted-foreground">
          Demo workspace — data is synthetic. No PHI, no outbound carrier integration.
        </p>
      </div>
      <ScrollArea className="flex-1">
        <div className="space-y-4 px-6 py-5">
          {messages.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No conversation yet — send an SMS or email, or simulate a call.
            </p>
          ) : (
            messages.map((m) => <MessageBubble key={m.id} message={m} />)
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
