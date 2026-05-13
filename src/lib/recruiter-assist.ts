import type { Candidate, CandidateStatus, TimelineMessage } from "@/lib/types";
import { DEMO_NOW_MS } from "@/data/seed";

export const recruiterAssistActions = [
  "thread_recap",
  "next_touch_prep",
  "compliance_scan",
  "scheduling_windows",
  "fit_score",
  "call_transcript_summary",
] as const;

export type RecruiterAssistAction = (typeof recruiterAssistActions)[number];

export interface ThreadRecapPayload {
  summaryLines: string[];
  openThreads: string[];
}

export interface NextTouchPrepPayload {
  checkpoints: string[];
  suggestedOpener: string;
}

export interface ComplianceScanPayload {
  corpusLabel: string;
  flags: { level: "info" | "warn" | "high"; detail: string }[];
  cleanFallbackCopy: string;
}

export interface SchedulingPayload {
  timezoneLabel: string;
  windows: { label: string; rationale: string }[];
}

export interface FitScorePayload {
  score: number;
  drivers: string[];
  cautions: string[];
}

export interface TranscriptSummaryPayload {
  structuredNotes: string;
  followUpSms: string;
}

export type RecruiterAssistPayload =
  | { action: "thread_recap"; data: ThreadRecapPayload }
  | { action: "next_touch_prep"; data: NextTouchPrepPayload }
  | { action: "compliance_scan"; data: ComplianceScanPayload }
  | { action: "scheduling_windows"; data: SchedulingPayload }
  | { action: "fit_score"; data: FitScorePayload }
  | { action: "call_transcript_summary"; data: TranscriptSummaryPayload };

function textFromMessage(m: TimelineMessage): string {
  if (m.kind === "email") {
    return [m.subject, m.body].filter(Boolean).join(" — ");
  }
  if (m.kind === "call") {
    return [m.disposition, m.callNotes].filter(Boolean).join(" — ");
  }
  return m.body ?? "";
}

function hoursSinceLastInteraction(messages: TimelineMessage[]): number {
  const last = messages.at(-1);
  if (!last) return 999;
  const ms = DEMO_NOW_MS - Date.parse(last.createdAt);
  return Math.max(0, ms / (1000 * 60 * 60));
}

const riskPatterns: { re: RegExp; level: "info" | "warn" | "high"; detail: string }[] = [
  {
    re: /\bguaranteed\b|\bguarantee\b/i,
    level: "high",
    detail:
      "Avoid implying a guaranteed offer or placement outcome — rephrase as process + next steps.",
  },
  {
    re: /\bvisa\b.*\bguaranteed\b|\bguaranteed\b.*\bvisa\b/i,
    level: "high",
    detail: "Immigration language is sensitive; route complex promises to counsel/Ops wording.",
  },
  {
    re: /\$\d|USD|\b\d+k\b|\bsalary\b.*\$\d|\bpay\b.*\$\d/i,
    level: "warn",
    detail:
      "Specific compensation talk should reference formal offer docs, not informal chat pledges.",
  },
  {
    re: /\bstart next week\b|\bstarts tomorrow\b/i,
    level: "warn",
    detail:
      "Hard start dates typically need employer confirmation — soften to tentative availability.",
  },
];

export function runRecruiterAssistMock(input: {
  action: RecruiterAssistAction;
  candidate: Candidate;
  messages: TimelineMessage[];
  draftSnippet?: string;
  transcriptSnippet?: string;
}): RecruiterAssistPayload {
  const { action, candidate, messages, draftSnippet = "", transcriptSnippet = "" } = input;
  switch (action) {
    case "thread_recap": {
      const recent = [...messages].slice(-6);
      const inbound = [...recent].filter((m) => m.direction === "inbound").length;
      const outbound = [...recent].filter((m) => m.direction === "outbound").length;
      const lastInbound = [...messages].reverse().find((m) => m.direction === "inbound");
      const inboundPreview =
        lastInbound && textFromMessage(lastInbound).trim().length > 6
          ? textFromMessage(lastInbound).slice(0, 160)
          : "No inbound detail captured in Phase 1 mock.";

      return {
        action,
        data: {
          summaryLines: [
            `${String(recent.length)} recent exchanges · ${String(inbound)} inbound · ${String(outbound)} outbound.`,
            `${candidate.specialty} candidate in ${candidate.licenseState}; status ${candidate.status}.`,
            inboundPreview.startsWith("No inbound")
              ? inboundPreview
              : `Latest candidate note excerpt: "${inboundPreview}${inboundPreview.length >= 160 ? "…" : ""}"`,
          ],
          openThreads: [
            "Confirm documents timeline if visa topics surfaced.",
            "Align on geography + shift preference before attaching hospital names.",
          ],
        },
      };
    }
    case "next_touch_prep": {
      const touches = messages.filter((m) => m.kind === "call").length;
      return {
        action,
        data: {
          checkpoints: [
            "Re-affirm sponsorship expectations and timelines in plain English.",
            "Confirm licensure portability for target states.",
            touches > 0
              ? "Reference last call disposition and avoid contradicting disposition notes."
              : "Offer a crisp SMS recap if inbox is cluttered.",
          ],
          suggestedOpener: `Hey ${candidate.firstName} — quick follow-up from Flint on ${candidate.specialty} roles. Anything blocking you from a 15‑min sync today?`,
        },
      };
    }
    case "compliance_scan": {
      const corpus = [...messages]
        .slice(-12)
        .map((m) => textFromMessage(m))
        .concat(draftSnippet)
        .join("\n")
        .slice(0, 8000);
      const corpusLabel =
        corpus.trim().length > 0 ? "Thread slice + drafted text" : "Draft-only scan";
      const flags = riskPatterns
        .filter(({ re }) => re.test(corpus))
        .map(({ level, detail }) => ({ level, detail }));

      return {
        action,
        data: {
          corpusLabel,
          flags:
            flags.length > 0
              ? flags
              : [{ level: "info", detail: "No blatant risky claims detected — still have a human verify." }],
          cleanFallbackCopy:
            "We'll walk through timelines and sponsorship steps as they exist today — formal terms come with employer paperwork.",
        },
      };
    }
    case "scheduling_windows": {
      const tz = candidate.timezone.replaceAll("_", " ");
      return {
        action,
        data: {
          timezoneLabel: tz,
          windows: [
            {
              label: "Today · 45 minutes starting 17:30 local",
              rationale: "Fits clinicians finishing day shift on the west coast.",
            },
            {
              label: "Tomorrow · 11:30 local (video okay)",
              rationale: "Mid-morning minimizes overnight page fatigue.",
            },
            {
              label: "Thu · 07:45 local SMS ping + call",
              rationale: "Great for ICU/ER swings when inboxes spike overnight.",
            },
          ],
        },
      };
    }
    case "fit_score": {
      const hrs = hoursSinceLastInteraction(messages);
      const responsiveness = hrs < 48 ? "fresh" : hrs < 120 ? "warming" : "stale";

      let score = 62;
      const drivers: string[] = [];
      const cautions: string[] = [];

      score += statusLift(candidate.status, drivers, cautions);

      switch (responsiveness) {
        case "fresh":
          score += 14;
          drivers.push("Candidate engaged within the past 48h (demo heuristic).");
          break;
        case "warming":
          score += 4;
          drivers.push("Touches are recent enough to capitalize with a succinct SMS.");
          break;
        case "stale":
          cautions.push("Stale thread (>5d heuristic) — re-open with empathy + recap.");
          score -= 6;
          break;
        default: {
          const _n: never = responsiveness;
          return _n;
        }
      }

      if (candidate.licenseState.includes("compact")) {
        score += 4;
        drivers.push("Compact-friendly license lowers geographic friction.");
      }

      score = Math.min(98, Math.max(18, score));

      return {
        action,
        data: { score, drivers, cautions },
      };
    }
    case "call_transcript_summary": {
      const seeded =
        transcriptSnippet.trim().slice(0, 4000) ||
        synthesizePseudoTranscriptFromCall(messages);

      const structuredNotes =
        seeded.trim().length < 40
          ? "No transcript pasted — mocked summary uses last disposition only."
          : `DISPO — ${seeded.includes("voicemail") ? "Candidate left voicemail" : "Brief connect"}\n` +
            `ASKS — Geography comfort, sponsorship cadence.\n` +
            `NEXT — Send SMS recap + roster packet teaser.`;

      const followUpSms = `Hey ${candidate.firstName} — thanks for the chat. Sending a recap + next steps shortly. Ping me if tonight works for a quick read-through.`;

      return {
        action,
        data: { structuredNotes, followUpSms },
      };
    }
    default: {
      const _e: never = action;
      return _e;
    }
  }
}

function synthesizePseudoTranscriptFromCall(messages: TimelineMessage[]): string {
  const lastCall = [...messages].reverse().find((m) => m.kind === "call");
  if (!lastCall) return "";
  return [
    "Recruiter: checking in on hospital fit and pay expectations.",
    `Candidate: references ${lastCall.disposition ?? "recent touchpoint"}.`,
    lastCall.callNotes ? `Notes: ${lastCall.callNotes}` : "",
  ]
    .filter(Boolean)
    .join("\n");
}

function statusLift(
  status: CandidateStatus,
  drivers: string[],
  cautionsBucket: string[],
): number {
  switch (status) {
    case "active":
      drivers.push("Status is active — pipeline momentum.");
      return 10;
    case "new":
      drivers.push("New lead — strong window to set expectations early.");
      return 6;
    case "waiting":
      cautionsBucket.push("Waiting state — confirm blockers before over-messaging.");
      return 0;
    default: {
      const _n: never = status;
      return _n;
    }
  }
}
