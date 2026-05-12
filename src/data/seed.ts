import type { Candidate, TimelineMessage } from "@/lib/types";

/**
 * Fixed demo clock anchor so SSR + hydration render identical timelines.
 * (Avoids Date.now() in module scope, which differs per request/ms.)
 */
export const DEMO_ANCHOR_ISO = "2026-05-11T18:30:00.000Z";

export const DEMO_NOW_MS = Date.parse(DEMO_ANCHOR_ISO);

const ANCHOR = DEMO_ANCHOR_ISO;

function hoursBeforeAnchor(hours: number): string {
  const ms = Date.parse(ANCHOR) - hours * 60 * 60 * 1000;
  return new Date(ms).toISOString();
}

export const SEED_CANDIDATES: Candidate[] = [
  {
    id: "cand-01",
    firstName: "María",
    lastName: "González",
    email: "maria.gonzalez@example.com",
    phoneE164: "+14155550123",
    phoneDisplay: "(415) 555-0123",
    timezone: "America/Los_Angeles",
    licenseState: "CA",
    specialty: "Med-Surg RN",
    status: "waiting",
    lastTouchAt: hoursBeforeAnchor(26),
  },
  {
    id: "cand-02",
    firstName: "James",
    lastName: "Okonkwo",
    email: "james.okonkwo@example.com",
    phoneE164: "+12125559876",
    phoneDisplay: "(212) 555-9876",
    timezone: "America/New_York",
    licenseState: "NY",
    specialty: "ICU RN",
    status: "active",
    lastTouchAt: hoursBeforeAnchor(3),
  },
  {
    id: "cand-03",
    firstName: "Priya",
    lastName: "Nair",
    email: "priya.nair@example.com",
    phoneE164: "+13105551290",
    phoneDisplay: "(310) 555-1290",
    timezone: "America/Los_Angeles",
    licenseState: "AZ (compact)",
    specialty: "ER RN",
    status: "new",
    lastTouchAt: hoursBeforeAnchor(72),
  },
  {
    id: "cand-04",
    firstName: "Elena",
    lastName: "Varga",
    email: "elena.varga@example.com",
    phoneE164: "+17035550444",
    phoneDisplay: "(703) 555-0444",
    timezone: "America/New_York",
    licenseState: "VA",
    specialty: "OR RN",
    status: "active",
    lastTouchAt: hoursBeforeAnchor(1),
  },
  {
    id: "cand-05",
    firstName: "Daniel",
    lastName: "Kim",
    email: "daniel.kim@example.com",
    phoneE164: "+18085550777",
    phoneDisplay: "(808) 555-0777",
    timezone: "Pacific/Honolulu",
    licenseState: "HI",
    specialty: "Stepdown RN",
    status: "waiting",
    lastTouchAt: hoursBeforeAnchor(6),
  },
];

/** Baseline inbound history — timestamps derived from anchor for stable SSR/client output */
export const SEED_TIMELINE: TimelineMessage[] = [
  {
    id: "m-seed-1",
    candidateId: "cand-01",
    kind: "sms",
    direction: "outbound",
    createdAt: hoursBeforeAnchor(48),
    body: "Hi María — Flint here. We'd love to share a traveler role near SF. Interested in hearing more?",
  },
  {
    id: "m-seed-2",
    candidateId: "cand-01",
    kind: "sms",
    direction: "inbound",
    createdAt: hoursBeforeAnchor(42),
    body: "Yes please. Visa timing is tight for me.",
  },
  {
    id: "m-seed-3",
    candidateId: "cand-02",
    kind: "email",
    direction: "inbound",
    createdAt: hoursBeforeAnchor(30),
    subject: "Re: ICU contract — start date",
    body: "I can start after April 14. Do you have nights available?",
  },
  {
    id: "m-seed-4",
    candidateId: "cand-02",
    kind: "call",
    direction: "outbound",
    createdAt: hoursBeforeAnchor(24),
    disposition: "answered",
    durationSec: 412,
    callNotes: "Discussed housing stipend and shift preference (nights).",
  },
  {
    id: "m-seed-5",
    candidateId: "cand-03",
    kind: "sms",
    direction: "outbound",
    createdAt: hoursBeforeAnchor(80),
    body: "Welcome to Flint, Priya — reply YES if you'd like a recruiter to call this week.",
  },
  {
    id: "m-seed-6",
    candidateId: "cand-04",
    kind: "email",
    direction: "outbound",
    createdAt: hoursBeforeAnchor(2),
    subject: "OR roles — Texas & nearby",
    body: "Hi Elena, sharing a few OR openings with Green Card sponsorship. Let me know your preferred cities.",
  },
  {
    id: "m-seed-7",
    candidateId: "cand-05",
    kind: "call",
    direction: "outbound",
    createdAt: hoursBeforeAnchor(8),
    disposition: "voicemail",
    durationSec: 32,
    callNotes: "Left VM with callback number and ETA for follow-up SMS.",
  },
];
