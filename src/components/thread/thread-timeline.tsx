"use client";

import type { TimelineMessage } from "@/lib/types";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import {
  Phone,
  Mail,
  MessageSquare,
  ArrowDownLeft,
  ArrowUpRight,
  Info,
} from "lucide-react";
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
  messages,
}: {
  messages: TimelineMessage[];
}) {
  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden bg-muted/25">
      <div className="shrink-0 px-4 py-2.5 md:px-5 md:py-3">
        <div className="flex items-center justify-between gap-2">
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">Activity</p>
              {messages.length > 0 ? (
                <span className="text-[11px] text-muted-foreground tabular-nums">
                  {messages.length} {messages.length === 1 ? "event" : "events"}
                </span>
              ) : null}
            </div>
          </div>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                className="shrink-0 rounded-xl text-muted-foreground hover:text-foreground"
                aria-label="About this activity feed"
              >
                <Info className="size-4" aria-hidden />
              </Button>
            </PopoverTrigger>
            <PopoverContent align="end" className="w-80 space-y-2">
              <p className="text-sm font-medium text-foreground">What you&apos;re seeing</p>
              <p className="text-xs leading-snug text-muted-foreground">
                A single chronological thread: SMS, email, and logged calls. Compose replies from the panel below.
                Contact details live under <span className="font-medium text-foreground">Contact</span> in the header.
              </p>
              <p className="text-[11px] leading-snug text-muted-foreground">
                Demo only — synthetic data, no PHI, no outbound integrations.
              </p>
            </PopoverContent>
          </Popover>
        </div>
      </div>
      <ScrollArea className="min-h-0 flex-1">
        <div className="space-y-3 px-4 py-3 md:space-y-4 md:px-5 md:py-4">
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
