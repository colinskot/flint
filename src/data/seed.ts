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

/** Hand-authored demo rows referenced by `SEED_TIMELINE` — keep ids cand-01 … cand-05 stable. */
const SEED_CANDIDATES_CORE: Candidate[] = [
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

const DEMO_FIRST_NAMES = [
  "María",
  "James",
  "Priya",
  "Elena",
  "Daniel",
  "Aisha",
  "Wei",
  "Olivia",
  "Marcus",
  "Sofia",
  "Henry",
  "Yuki",
  "Amir",
  "Zara",
  "Luis",
  "Hannah",
  "Diego",
  "Fatima",
  "Noah",
  "Keisha",
  "Jonas",
  "Min-jun",
  "Chloe",
  "Ibrahim",
  "Grace",
  "Mateo",
  "Nia",
  "Raj",
  "Camila",
  "Theo",
  "Brianna",
  "Samir",
  "Rachel",
  "Pavel",
  "Tanya",
  "Oscar",
  "Leilani",
  "Viktor",
  "Anika",
  "Jordan",
  "Cooper",
  "Esperanza",
];

const DEMO_LAST_NAMES = [
  "González",
  "Okonkwo",
  "Nair",
  "Varga",
  "Kim",
  "Patel",
  "Johnson",
  "Martinez",
  "Okafor",
  "Silva",
  "Chen",
  "Nguyen",
  "Hassan",
  "Bergstrom",
  "Rivera",
  "Olsen",
  "Fernández",
  "Al-Farsi",
  "Williams",
  "Schmidt",
  "Santos",
  "Nakamura",
  "Cohen",
  "Murphy",
  "Kowalski",
  "Diallo",
  "Park",
  "Romano",
  "Andersen",
  "Owens",
  "Duarte",
  "Lindqvist",
  "O’Connell",
  "Popov",
  "Watanabe",
  "Okoro",
  "Bautista",
  "Kaminski",
  "Desai",
  "Bishop",
  "Zhang",
  "Morales",
  "Kaur",
  "Mensah",
  "Vasquez",
];

const DEMO_SPECIALTIES = [
  "Med-Surg RN",
  "ICU RN",
  "ER RN",
  "OR RN",
  "Stepdown RN",
  "Telemetry RN",
  "PACU RN",
  "NICU RN",
  "L&D RN",
  "Mother-Baby RN",
  "Psych RN",
  "Cath Lab RN",
  "IR RN",
  "Dialysis RN",
  "Home Health RN",
  "School Nurse",
  "NP — Family",
  "NP — Acute Care",
  "Clinical Nurse Educator",
  "Float Pool RN",
  "CVICU RN",
  "MICU RN",
  "SICU RN",
  "Burn Unit RN",
  "Transplant RN",
  "Oncology RN",
  "Infusion RN",
  "Urgent Care RN",
  "SNF RN",
  "Rehab RN",
  "Hemodialysis RN",
  "Perioperative RN",
  "Case Manager RN",
  "Travel Med-Surg",
  "Travel ICU",
  "OB Tech / RN",
  "Peds RN",
  "PICU RN",
  "Wound Care RN",
  "Endoscopy RN",
];

const DEMO_STATE_TZ: { licenseState: string; timezone: string }[] = [
  { licenseState: "CA", timezone: "America/Los_Angeles" },
  { licenseState: "NY", timezone: "America/New_York" },
  { licenseState: "TX (compact)", timezone: "America/Chicago" },
  { licenseState: "FL", timezone: "America/New_York" },
  { licenseState: "WA", timezone: "America/Los_Angeles" },
  { licenseState: "IL", timezone: "America/Chicago" },
  { licenseState: "PA", timezone: "America/New_York" },
  { licenseState: "OH", timezone: "America/New_York" },
  { licenseState: "GA", timezone: "America/New_York" },
  { licenseState: "NC", timezone: "America/New_York" },
  { licenseState: "MI", timezone: "America/Detroit" },
  { licenseState: "AZ (compact)", timezone: "America/Phoenix" },
  { licenseState: "CO", timezone: "America/Denver" },
  { licenseState: "OR", timezone: "America/Los_Angeles" },
  { licenseState: "NV", timezone: "America/Los_Angeles" },
  { licenseState: "UT", timezone: "America/Denver" },
  { licenseState: "NM", timezone: "America/Denver" },
  { licenseState: "KS", timezone: "America/Chicago" },
  { licenseState: "MO", timezone: "America/Chicago" },
  { licenseState: "TN", timezone: "America/Chicago" },
  { licenseState: "IN", timezone: "America/Indiana/Indianapolis" },
  { licenseState: "KY", timezone: "America/New_York" },
  { licenseState: "VA", timezone: "America/New_York" },
  { licenseState: "SC", timezone: "America/New_York" },
  { licenseState: "MA", timezone: "America/New_York" },
  { licenseState: "ME", timezone: "America/New_York" },
  { licenseState: "HI", timezone: "Pacific/Honolulu" },
  { licenseState: "AK", timezone: "America/Anchorage" },
  { licenseState: "WI", timezone: "America/Chicago" },
  { licenseState: "MN", timezone: "America/Chicago" },
  { licenseState: "IA", timezone: "America/Chicago" },
  { licenseState: "NE", timezone: "America/Chicago" },
  { licenseState: "OK", timezone: "America/Chicago" },
  { licenseState: "AR", timezone: "America/Chicago" },
  { licenseState: "LA", timezone: "America/Chicago" },
  { licenseState: "MS", timezone: "America/Chicago" },
  { licenseState: "AL", timezone: "America/Chicago" },
  { licenseState: "ID", timezone: "America/Boise" },
  { licenseState: "MT", timezone: "America/Denver" },
  { licenseState: "WY", timezone: "America/Denver" },
  { licenseState: "ND", timezone: "America/Chicago" },
];

const DEMO_STATUSES: Candidate["status"][] = ["new", "active", "waiting"];

function slugEmailPart(s: string): string {
  return s
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z]/g, "")
    .toLowerCase();
}

function syntheticPhoneParts(index: number): { e164: string; display: string } {
  const areaCodes = [
    212, 310, 415, 503, 602, 615, 702, 713, 801, 904, 206, 303, 404, 512, 702,
  ];
  const ac = areaCodes[index % areaCodes.length];
  const last4 = (index * 7919 + 240) % 10000;
  const nnn = String(last4).padStart(4, "0");
  return {
    e164: `+1${String(ac)}555${nnn}`,
    display: `(${String(ac)}) 555-${nnn}`,
  };
}

function buildSyntheticCandidates(): Candidate[] {
  const out: Candidate[] = [];
  for (let i = 6; i <= 100; i++) {
    const id = i === 100 ? "cand-100" : `cand-${String(i).padStart(2, "0")}`;
    const fn = DEMO_FIRST_NAMES[(i * 13) % DEMO_FIRST_NAMES.length];
    const ln = DEMO_LAST_NAMES[(i * 17 + 3) % DEMO_LAST_NAMES.length];
    const spec = DEMO_SPECIALTIES[(i * 5) % DEMO_SPECIALTIES.length];
    const st = DEMO_STATE_TZ[(i * 7) % DEMO_STATE_TZ.length];
    const status = DEMO_STATUSES[i % DEMO_STATUSES.length];
    const fnSlug = slugEmailPart(fn) || "n";
    const lnSlug = slugEmailPart(ln) || "n";
    const hoursBack = (i * 11 + (i % 23) * 7 + (i % 5) * 31) % 720;
    const { e164, display } = syntheticPhoneParts(i);

    out.push({
      id,
      firstName: fn,
      lastName: ln,
      email: `${fnSlug}.${lnSlug}.${String(i)}@example.com`,
      phoneE164: e164,
      phoneDisplay: display,
      timezone: st.timezone,
      licenseState: st.licenseState,
      specialty: spec,
      status,
      lastTouchAt: hoursBeforeAnchor(hoursBack),
    });
  }
  return out;
}

export const SEED_CANDIDATES: Candidate[] = [
  ...SEED_CANDIDATES_CORE,
  ...buildSyntheticCandidates(),
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
