import {
  runRecruiterAssistMock,
} from "@/lib/recruiter-assist";
import { z } from "zod";

const assistActionSchema = z.enum([
  "thread_recap",
  "next_touch_prep",
  "compliance_scan",
  "scheduling_windows",
  "fit_score",
  "call_transcript_summary",
]);

const messageWireSchema = z.object({
  id: z.string(),
  candidateId: z.string(),
  kind: z.enum(["sms", "email", "call"]),
  direction: z.enum(["inbound", "outbound"]),
  createdAt: z.string(),
  body: z.string().optional(),
  subject: z.string().optional(),
  disposition: z
    .enum(["answered", "voicemail", "no_answer", "busy"])
    .optional(),
  callNotes: z.string().optional(),
  durationSec: z.number().optional(),
});

const candidateWireSchema = z.object({
  id: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  specialty: z.string(),
  licenseState: z.string(),
  status: z.enum(["new", "active", "waiting"]),
  timezone: z.string(),
  lastTouchAt: z.string(),
  email: z.string(),
  phoneE164: z.string(),
  phoneDisplay: z.string(),
});

const bodySchema = z.object({
  action: assistActionSchema,
  candidate: candidateWireSchema,
  messages: z.array(messageWireSchema),
  draftSnippet: z.string().optional(),
  transcriptSnippet: z.string().optional(),
});

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    body = null;
  }

  const parsed = bodySchema.safeParse(body);
  if (!parsed.success) {
    return Response.json({ error: "Invalid payload" }, { status: 400 });
  }

  const data = parsed.data;
  const payload = runRecruiterAssistMock({
    action: data.action,
    candidate: data.candidate,
    messages: data.messages,
    draftSnippet: data.draftSnippet,
    transcriptSnippet: data.transcriptSnippet,
  });

  return Response.json({ mock: true, result: payload });
}
