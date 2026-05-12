export type CandidateStatus = "new" | "active" | "waiting";

export interface Candidate {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneE164: string;
  phoneDisplay: string;
  timezone: string;
  licenseState: string;
  specialty: string;
  status: CandidateStatus;
  lastTouchAt: string;
}

export type MessageKind = "sms" | "email" | "call";

export interface TimelineMessage {
  id: string;
  candidateId: string;
  kind: MessageKind;
  direction: "outbound" | "inbound";
  createdAt: string;
  body?: string;
  subject?: string;
  disposition?: "answered" | "voicemail" | "no_answer" | "busy";
  durationSec?: number;
  callNotes?: string;
}

export type ComposeChannel = "sms" | "email";

export type MessageTone = "professional" | "friendly" | "urgent";
