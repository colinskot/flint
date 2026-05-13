"use client";

import type { Candidate, TimelineMessage } from "@/lib/types";
import type {
  RecruiterAssistAction,
  RecruiterAssistPayload,
} from "@/lib/recruiter-assist";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { Clipboard, Loader2, Sparkles } from "lucide-react";
import { useCallback, useMemo, useState } from "react";
import { toast } from "sonner";

interface ToolkitTab {
  id: RecruiterAssistAction;
  title: string;
  description: string;
}

const TABS: ToolkitTab[] = [
  {
    id: "thread_recap",
    title: "Recap",
    description: "Condense the recent thread into recruiter-ready bullets.",
  },
  {
    id: "next_touch_prep",
    title: "Prep",
    description: "Checklist + opener for the next live touch.",
  },
  {
    id: "compliance_scan",
    title: "Guardrails",
    description: "Heuristic sweep for risky claims in thread + drafts.",
  },
  {
    id: "scheduling_windows",
    title: "Schedule",
    description: "Mock smart windows anchored to candidate local time.",
  },
  {
    id: "fit_score",
    title: "Triage",
    description: "Pursuit score from demo rules (not predictive).",
  },
  {
    id: "call_transcript_summary",
    title: "Notes",
    description: "Structure call notes / transcript into follow-up actions.",
  },
];

function ComplianceLevel({
  level,
}: {
  level: "info" | "warn" | "high";
}) {
  const label =
    level === "high" ? "High" : level === "warn" ? "Warn" : "Info";
  return (
    <Badge
      variant="outline"
      className={cn(
        "text-[10px] uppercase tracking-wide",
        level === "high" &&
          "border-destructive/40 text-destructive",
        level === "warn" && "border-amber-500/50 text-amber-800 dark:text-amber-200",
        level === "info" && "text-muted-foreground",
      )}
    >
      {label}
    </Badge>
  );
}

function ResultPanel({ payload }: { payload: RecruiterAssistPayload }) {
  switch (payload.action) {
    case "thread_recap": {
      const { summaryLines, openThreads } = payload.data;
      return (
        <div className="space-y-3 text-sm">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Snapshot
            </p>
            <ul className="mt-2 list-disc space-y-1 pl-4 text-foreground">
              {summaryLines.map((line) => (
                <li key={line}>{line}</li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Still clarify
            </p>
            <ul className="mt-2 list-disc space-y-1 pl-4 text-muted-foreground">
              {openThreads.map((line) => (
                <li key={line}>{line}</li>
              ))}
            </ul>
          </div>
        </div>
      );
    }
    case "next_touch_prep": {
      const { checkpoints, suggestedOpener } = payload.data;
      return (
        <div className="space-y-4 text-sm">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Checklist
            </p>
            <ul className="mt-2 list-disc space-y-1 pl-4">
              {checkpoints.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Suggested opener
            </p>
            <p className="mt-2 rounded-xl border border-dashed border-border bg-muted/50 p-3 text-sm leading-snug">
              {suggestedOpener}
            </p>
          </div>
        </div>
      );
    }
    case "compliance_scan": {
      const { flags, corpusLabel, cleanFallbackCopy } = payload.data;
      return (
        <div className="space-y-3 text-sm">
          <p className="text-xs text-muted-foreground">{corpusLabel}</p>
          <div className="space-y-2">
            {flags.map((flag) => (
              <div
                key={`${flag.level}-${flag.detail}`}
                className="rounded-xl border border-border bg-card px-3 py-2 shadow-sm"
              >
                <div className="flex items-center gap-2">
                  <ComplianceLevel level={flag.level} />
                </div>
                <p className="mt-2 text-xs leading-snug text-foreground">
                  {flag.detail}
                </p>
              </div>
            ))}
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Safer wording
            </p>
            <p className="mt-2 rounded-xl border border-border bg-muted/50 p-3 text-xs leading-snug">
              {cleanFallbackCopy}
            </p>
          </div>
        </div>
      );
    }
    case "scheduling_windows": {
      const { timezoneLabel, windows } = payload.data;
      return (
        <div className="space-y-3 text-sm">
          <p className="text-xs text-muted-foreground">
            Anchored tz:{" "}
            <span className="font-semibold text-foreground">{timezoneLabel}</span>
          </p>
          <div className="space-y-2">
            {windows.map((window) => (
              <Card
                key={window.label}
                className="border-border px-4 py-3 text-sm shadow-sm"
              >
                <p className="font-medium text-foreground">{window.label}</p>
                <p className="mt-2 text-xs text-muted-foreground">
                  {window.rationale}
                </p>
              </Card>
            ))}
          </div>
        </div>
      );
    }
    case "fit_score": {
      const { score, drivers, cautions } = payload.data;
      const width = `${String(Math.round(score))}%`;
      return (
        <div className="space-y-3 text-sm">
          <div>
            <div className="flex items-baseline gap-2">
              <p className="text-4xl font-semibold text-foreground">{score}</p>
              <p className="text-xs uppercase tracking-wide text-muted-foreground">
                /100 pursuit score · demo rules
              </p>
            </div>
            <div className="mt-3 h-2 rounded-full bg-muted">
              <div
                className="h-full rounded-full bg-gradient-to-r from-primary to-accent"
                style={{ width }}
              />
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Boosters
              </p>
              <ul className="mt-2 list-disc space-y-1 pl-4">
                {drivers.map((driver) => (
                  <li key={driver}>{driver}</li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Watch-outs
              </p>
              {cautions.length === 0 ? (
                <p className="mt-2 text-xs text-muted-foreground">None flagged.</p>
              ) : (
                <ul className="mt-2 list-disc space-y-1 pl-4 text-amber-900 dark:text-amber-100">
                  {cautions.map((warning) => (
                    <li key={warning}>{warning}</li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      );
    }
    case "call_transcript_summary": {
      const { structuredNotes, followUpSms } = payload.data;
      return (
        <div className="space-y-3 text-sm">
          <div className="rounded-xl border border-border bg-muted/50 p-3 text-xs leading-relaxed whitespace-pre-wrap">
            {structuredNotes}
          </div>
          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Suggested SMS follow-up
            </p>
            <Card className="border-dashed px-3 py-2 text-xs leading-snug">
              {followUpSms}
            </Card>
            <Button
              type="button"
              variant="secondary"
              size="sm"
              className="h-8 gap-1 px-3 text-xs"
              onClick={async () => {
                await navigator.clipboard.writeText(followUpSms);
                toast.success("Copied suggested SMS.");
              }}
            >
              <Clipboard className="size-3.5" aria-hidden />
              Copy SMS
            </Button>
          </div>
        </div>
      );
    }
    default: {
      const exhaustive: never = payload;
      return exhaustive;
    }
  }
}

export function RecruiterAiToolkit({
  candidate,
  messages,
}: {
  candidate: Candidate;
  messages: TimelineMessage[];
}) {
  const [active, setActive] = useState<RecruiterAssistAction>("thread_recap");
  const [results, setResults] = useState<
    Partial<Record<RecruiterAssistAction, RecruiterAssistPayload>>
  >({});
  const [draftSnippet, setDraftSnippet] = useState("");
  const [transcriptSnippet, setTranscriptSnippet] = useState("");
  const [busy, setBusy] = useState(false);

  const wiredMessages = useMemo(() => messages, [messages]);

  const runAssist = useCallback(
    async (action: RecruiterAssistAction) => {
      setBusy(true);
      try {
        const res = await fetch("/api/recruiter-assist", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action,
            candidate,
            messages: wiredMessages,
            draftSnippet:
              action === "compliance_scan"
                ? draftSnippet
                : undefined,
            transcriptSnippet:
              action === "call_transcript_summary"
                ? transcriptSnippet
                : undefined,
          }),
        });

        if (!res.ok) {
          throw new Error("assist_failed");
        }

        const payload = (await res.json()) as {
          mock: boolean;
          result: RecruiterAssistPayload;
        };

        setResults((prev) => ({
          ...prev,
          [action]: payload.result,
        }));
        toast.success("Mock insights ready.");
      } catch {
        toast.error("Could not run recruiter assist mocks.");
      } finally {
        setBusy(false);
      }
    },
    [
      candidate,
      draftSnippet,
      transcriptSnippet,
      wiredMessages,
    ],
  );

  return (
    <Card className="border-border shadow-sm">
      <div className="border-b border-border px-4 py-3 md:px-5">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 text-primary">
            <Sparkles className="size-4" aria-hidden />
            <div>
              <p className="text-sm font-semibold text-foreground">
                AI copilot (mock APIs)
              </p>
              <p className="text-xs text-muted-foreground">
                Tabbed recruiter assists via <code className="font-mono text-[11px]">POST /api/recruiter-assist</code>.
                Compose drafts separately with <strong className="font-medium text-foreground">AI draft</strong> in the composer ({" "}
                <code className="font-mono text-[11px]">/api/compose</code> + optional{" "}
                <code className="font-mono text-[11px]">OPENAI_API_KEY</code>
                ).
              </p>
            </div>
          </div>
          <Badge variant="secondary" className="uppercase tracking-wide">
            Deterministic mocks
          </Badge>
        </div>
      </div>

      <div className="px-4 py-3 md:px-5 md:py-4">
        <Tabs
          value={active}
          onValueChange={(value) => { setActive(value as RecruiterAssistAction); }}
          className="w-full gap-4"
        >
          <TabsList className="flex w-full flex-nowrap justify-start gap-1 overflow-x-auto rounded-xl bg-muted/80 p-1 md:flex-wrap md:justify-start md:gap-2">
            {TABS.map((tab) => (
              <TabsTrigger
                key={tab.id}
                value={tab.id}
                className="whitespace-nowrap rounded-lg px-3 py-2 text-[11px] uppercase tracking-wide data-[state=active]:shadow-sm md:text-xs"
              >
                {tab.title}
              </TabsTrigger>
            ))}
          </TabsList>

          {TABS.map((tab) => {
            const snapshot = results[tab.id];
            return (
            <TabsContent key={tab.id} value={tab.id}>
              <p className="text-xs leading-snug text-muted-foreground">
                {tab.description}
              </p>
              <Separator className="my-4" />

              {tab.id === "compliance_scan" && (
                <div className="mb-4 space-y-2">
                  <p className="text-xs font-medium text-foreground">
                    Optional draft snippet
                  </p>
                  <Textarea
                    value={draftSnippet}
                    onChange={(e) => { setDraftSnippet(e.target.value); }}
                    placeholder="Paste the SMS/email you are about to send for an extra heuristic scan."
                    className="rounded-xl border-border text-sm leading-snug"
                    rows={3}
                  />
                </div>
              )}

              {tab.id === "call_transcript_summary" && (
                <div className="mb-4 space-y-2">
                  <p className="text-xs font-medium text-foreground">
                    Paste transcript excerpt (demo)
                  </p>
                  <Textarea
                    value={transcriptSnippet}
                    onChange={(e) => { setTranscriptSnippet(e.target.value); }}
                    placeholder="Paste a VOIP transcript slice — or leave empty to synthesize notes from last logged call."
                    className="rounded-xl border-border text-sm leading-snug"
                    rows={4}
                  />
                </div>
              )}

              <Button
                type="button"
                size="sm"
                className="gap-2 rounded-xl"
                disabled={busy}
                onClick={() => { void runAssist(tab.id); }}
              >
                {busy ? (
                  <Loader2 className="size-4 animate-spin" aria-hidden />
                ) : (
                  <Sparkles className="size-4" aria-hidden />
                )}
                Generate insights
              </Button>

              {snapshot ? (
                <ScrollArea className="mt-4 max-h-[360px] pr-4">
                  <ResultPanel payload={snapshot} />
                </ScrollArea>
              ) : null}
            </TabsContent>
            );
          })}
        </Tabs>
      </div>
    </Card>
  );
}
