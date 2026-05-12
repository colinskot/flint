import { openai } from "@ai-sdk/openai";
import { generateObject } from "ai";
import { z } from "zod";

const bodySchema = z.object({
  channel: z.enum(["sms", "email"]),
  tone: z.enum(["professional", "friendly", "urgent"]),
  candidateFirstName: z.string().min(1),
  specialty: z.string(),
  licenseState: z.string(),
  lastInboundPreview: z.string().nullable().optional(),
});

const responseSchema = z.object({
  smsBody: z.string().optional(),
  emailSubject: z.string().optional(),
  emailBody: z.string().optional(),
});

function fallbackDraft(
  parsed: z.infer<typeof bodySchema>,
): z.infer<typeof responseSchema> {
  const name = parsed.candidateFirstName;
  const last = parsed.lastInboundPreview?.trim();

  if (parsed.channel === "sms") {
    const lines: Record<
      typeof parsed.tone,
      string
    > = {
      professional: last
        ? `Hi ${name}, thanks for your note. I'll confirm immigration timing with ops and ping you shortly.`
        : `Hi ${name}, following up from Flint on ${parsed.specialty} roles — can I share two openings today?`,
      friendly: last
        ? `Hey ${name} — appreciate the quick reply! I'll dig into timelines and circle back ASAP. 😊`
        : `Hey ${name}! Hope your week's going well — want a quick rundown of roles that fit your license in ${parsed.licenseState}?`,
      urgent: last
        ? `${name}, time-sensitive — can you reply with earliest call window today? Hiring manager needs availability.`
        : `${name}: urgent traveler fit for ${parsed.specialty}. Reply YES for a callback in the next hour.`,
    };
    return { smsBody: lines[parsed.tone] };
  }

  const subj =
    parsed.tone === "urgent"
      ? `ACTION: Flint — ${parsed.specialty} opportunity (visa timeline)`
      : parsed.tone === "friendly"
        ? `Checking in — ${parsed.specialty} roles at Flint`
        : `Next steps — Flint (${parsed.licenseState}-licensed RN opportunities)`;

  const email =
    parsed.tone === "professional"
      ? `Hi ${name},\n\nThanks for connecting with Flint. Based on your background in ${parsed.specialty}${last ? ` and your recent message (${last.slice(0, 120)}${last.length > 120 ? "…" : ""})` : ""}, I'd like to share a concise packet of openings and sponsorship details.\n\nCould you reply with your preferred geography and earliest start?\n\nBest,\nFlint Recruiting`
      : parsed.tone === "friendly"
        ? `Hey ${name}!\n\nLoved learning more about your experience in ${parsed.specialty}. I pulled a handful of openings that align with hospitals we work with.${last ? `\n\nAlso noted this from you: "${last.slice(0, 200)}${last.length > 200 ? "…" : ""}"` : ""}\n\nWant me to text you the highlights instead of email?\n\n— Flint`
        : `Hi ${name},\n\nWe're moving quickly on a sponsor-backed role that matches ${parsed.specialty}.${last ? `\nContext you shared:\n"${last.slice(0, 200)}${last.length > 200 ? "…" : ""}"\n\n` : "\n"}Please reply with today's best 30-minute callback window.\n\nThanks,\nFlint Recruiting`;

  return { emailSubject: subj, emailBody: email };
}

export async function POST(req: Request) {
  const json = await req.json().catch(() => null);
  const parsed = bodySchema.safeParse(json);
  if (!parsed.success) {
    return Response.json({ error: "Invalid payload" }, { status: 400 });
  }

  const data = parsed.data;

  const key = process.env.OPENAI_API_KEY?.trim();

  if (!key) {
    const draft = fallbackDraft(data);
    return Response.json({
      ...draft,
      fallback: true,
      reason: "OPENAI_API_KEY missing",
    });
  }

  try {
    const { object } = await generateObject({
      model: openai("gpt-4o-mini"),
      schema: responseSchema,
      prompt: `
You draft recruiter outreach for Flint Healthcare (visa-friendly nursing placement).
Tone: "${data.tone}".
Candidate first name: ${data.candidateFirstName}.
Specialty: ${data.specialty}.
License hint: ${data.licenseState}.

Last inbound excerpt (maybe null): ${JSON.stringify(data.lastInboundPreview ?? null)}

Compose for channel "${data.channel}" only:
- sms: concise text message, plain language, ≤ 320 chars, no emoji unless friendly tone permits one tasteful emoji.
- email: concise subject (< 72 chars ideal) + body under ~180 words.

Output JSON fields:
- sms: only smsBody populated
- email: emailSubject + emailBody

Do not include PHI; do not invent real hospitals.
`.trim(),
    });

    const cleaned = responseSchema.safeParse(object);
    if (!cleaned.success || !looksUseful(data.channel, cleaned.data)) {
      return Response.json({ ...fallbackDraft(data), fallback: true });
    }
    return Response.json({ ...cleaned.data, fallback: false });
  } catch {
    return Response.json({
      ...fallbackDraft(data),
      fallback: true,
      reason: "model_error",
    });
  }
}

function looksUseful(
  channel: "sms" | "email",
  draft: z.infer<typeof responseSchema>,
): boolean {
  if (channel === "sms") return !!(draft.smsBody && draft.smsBody.trim().length > 8);
  return !!(
    draft.emailSubject?.trim().length &&
    draft.emailBody &&
    draft.emailBody.trim().length > 24
  );
}
