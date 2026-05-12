"use client";

import type { Candidate, ComposeChannel, MessageTone } from "@/lib/types";
import { usePortal } from "@/context/portal-context";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Loader2, Sparkles, Phone } from "lucide-react";
import { toast } from "sonner";
import { useCallback, useMemo, useState } from "react";
import { CallSimulator } from "./call-simulator";

const SMS_TEMPLATES: { label: string; body: string }[] = [
  {
    label: "Follow-up (general)",
    body: "Hi {firstName}, just checking in on the role we discussed — can I answer any questions?",
  },
  {
    label: "Visa cadence",
    body: "{firstName}, wanted to clarify next steps with immigration timelines on our side.",
  },
  {
    label: "Start date",
    body: "Quick question: what's your earliest start date if we align on compensation?",
  },
];

const EMAIL_TEMPLATES: { label: string; subject: string; body: string }[] = [
  {
    label: "Role packet",
    subject: "Hospital roles ({specialty}) — next steps",
    body:
      "Hi {firstName},\n\nSharing a concise overview of openings that match your {specialty} background. Reply with your preferred cities.\n\n— Flint Recruiting",
  },
  {
    label: "Documents checklist",
    subject: "Documents we still need",
    body:
      "Hi {firstName},\n\nFriendly reminder on the checklist: license verification + updated resume. Happy to jump on a call if faster.\n\nThanks,\n{name}",
  },
];

function interpolate(template: string, c: Candidate) {
  return template
    .replaceAll("{firstName}", c.firstName)
    .replaceAll("{specialty}", c.specialty)
    .replaceAll("{name}", "Your recruiter"); // simplified
}

function gsmSegments(text: string) {
  if (text.length === 0) return { chars: 0, segments: 0, segSize: 160 };
  const nonGsm = /[^\u000cr\n !"#%&'(),.:;<=>?€£$\-_@^{}~\[\]|\\/*/]/;
  const segSize = nonGsm.test(text) ? 70 : 160;
  return {
    chars: text.length,
    segments: Math.ceil(text.length / segSize),
    segSize,
  };
}

export function UnifiedComposer({ candidate }: { candidate: Candidate }) {
  const { appendMessage, messagesFor } = usePortal();
  const timeline = messagesFor(candidate.id);

  const [smsBody, setSmsBody] = useState("");
  const [emailSubject, setEmailSubject] = useState("");
  const [emailBody, setEmailBody] = useState("");
  const [tone, setTone] = useState<MessageTone>("professional");
  const [aiBusy, setAiBusy] = useState(false);
  const [activeTab, setActiveTab] = useState("sms");

  const lastInbound = useMemo(() => [...timeline].reverse().find((m) => m.direction === "inbound"), [timeline]);

  const applyTemplateSms = useCallback(
    (key: string) => {
      const t = SMS_TEMPLATES.find((x) => x.label === key);
      if (t) setSmsBody(interpolate(t.body, candidate));
    },
    [candidate],
  );

  const applyTemplateEmail = useCallback(
    (key: string) => {
      const t = EMAIL_TEMPLATES.find((x) => x.label === key);
      if (!t) return;
      setEmailSubject(interpolate(t.subject, candidate));
      setEmailBody(interpolate(t.body, candidate));
    },
    [candidate],
  );

  const submitSms = useCallback(() => {
    const trimmed = smsBody.trim();
    if (!trimmed) {
      toast.error("Write something before sending.");
      return;
    }
    appendMessage({
      id: crypto.randomUUID(),
      candidateId: candidate.id,
      kind: "sms",
      direction: "outbound",
      createdAt: new Date().toISOString(),
      body: trimmed,
    });
    setSmsBody("");
    toast.success("SMS queued (demo — no carrier send)");
  }, [appendMessage, candidate.id, smsBody]);

  const submitEmail = useCallback(() => {
    const subject = emailSubject.trim();
    const body = emailBody.trim();
    if (!subject || !body) {
      toast.error("Subject and body are required.");
      return;
    }
    appendMessage({
      id: crypto.randomUUID(),
      candidateId: candidate.id,
      kind: "email",
      direction: "outbound",
      createdAt: new Date().toISOString(),
      subject,
      body,
    });
    setEmailSubject("");
    setEmailBody("");
    toast.success("Email drafted & logged (demo — no SMTP)");
  }, [appendMessage, candidate.id, emailBody, emailSubject]);

  const runAiAssist = async () => {
    const channel: ComposeChannel =
      activeTab === "email" ? "email" : "sms";

    setAiBusy(true);
    try {
      const res = await fetch("/api/compose", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          channel,
          tone,
          candidateFirstName: candidate.firstName,
          specialty: candidate.specialty,
          licenseState: candidate.licenseState,
          lastInboundPreview:
            lastInbound?.body ??
            lastInbound?.subject ??
            lastInbound?.callNotes ??
            null,
        }),
      });

      if (!res.ok) throw new Error("compose failed");

      const data = (await res.json()) as {
        smsBody?: string;
        emailSubject?: string;
        emailBody?: string;
        fallback?: boolean;
      };

      if (channel === "sms" && data.smsBody) {
        setSmsBody(data.smsBody);
        toast.success(
          data.fallback
            ? "Draft inserted (offline template fallback)"
            : "AI draft inserted",
        );
      } else if (
        channel === "email" &&
        data.emailSubject &&
        data.emailBody
      ) {
        setEmailSubject(data.emailSubject);
        setEmailBody(data.emailBody);
        toast.success(
          data.fallback
            ? "Draft inserted (offline template fallback)"
            : "AI draft inserted",
        );
      } else {
        toast.message("Got an empty suggestion — tweak tone and retry.");
      }
    } catch {
      toast.error("Could not compose — try again.");
    } finally {
      setAiBusy(false);
    }
  };

  const smsMeta = gsmSegments(smsBody);

  return (
    <div className="border-t border-border bg-card px-6 py-4 shadow-[0_-8px_30px_-18px_rgba(68,55,109,0.35)]">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <div>
          <p className="text-sm font-semibold text-foreground">Composer</p>
          <p className="text-xs text-muted-foreground">
            {candidate.phoneDisplay} · {candidate.email}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                type="button"
                variant="secondary"
                size="sm"
                className="gap-1.5 rounded-xl"
                onClick={runAiAssist}
                disabled={aiBusy}
              >
                {aiBusy ? (
                  <Loader2 className="size-4 animate-spin" aria-hidden />
                ) : (
                  <Sparkles className="size-4" aria-hidden />
                )}
                AI draft
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom" className="max-w-[16rem] text-xs">
              Fills the active SMS or Email tab — uses templates when{" "}
              <code className="font-mono">OPENAI_API_KEY</code> is unset.
            </TooltipContent>
          </Tooltip>
        </div>
      </div>

      <Card className="rounded-2xl border-border bg-sidebar p-4">
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-2">
            <Label className="text-xs uppercase tracking-wide text-muted-foreground">
              Draft tone (AI)
            </Label>
            <RadioGroup
              value={tone}
              onValueChange={(v: MessageTone) => setTone(v)}
              className="flex gap-4"
            >
              <div className="flex items-center gap-2">
                <RadioGroupItem id="tone-pro" value="professional" />
                <Label htmlFor="tone-pro" className="text-sm font-normal">
                  Professional
                </Label>
              </div>
              <div className="flex items-center gap-2">
                <RadioGroupItem id="tone-fr" value="friendly" />
                <Label htmlFor="tone-fr" className="text-sm font-normal">
                  Friendly
                </Label>
              </div>
              <div className="flex items-center gap-2">
                <RadioGroupItem id="tone-urg" value="urgent" />
                <Label htmlFor="tone-urg" className="text-sm font-normal">
                  Urgent
                </Label>
              </div>
            </RadioGroup>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 rounded-xl bg-muted/80">
            <TabsTrigger value="sms" className="rounded-lg">
              SMS
            </TabsTrigger>
            <TabsTrigger value="email" className="rounded-lg">
              Email
            </TabsTrigger>
            <TabsTrigger value="call" className="gap-1.5 rounded-lg">
              <Phone className="size-3.5" aria-hidden />
              Call
            </TabsTrigger>
          </TabsList>

          <TabsContent value="sms" className="mt-4 space-y-3">
            <div className="flex flex-wrap gap-2">
              <Select onValueChange={applyTemplateSms}>
                <SelectTrigger className="w-[220px] rounded-xl">
                  <SelectValue placeholder="Insert template" />
                </SelectTrigger>
                <SelectContent>
                  {SMS_TEMPLATES.map((t) => (
                    <SelectItem key={t.label} value={t.label}>
                      {t.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground self-center">
                ~{smsMeta.segments} segment{smsMeta.segments === 1 ? "" : "s"} (
                {smsMeta.segSize}-char units)
              </p>
            </div>
            <Textarea
              value={smsBody}
              onChange={(e) => setSmsBody(e.target.value)}
              placeholder="Write a concise SMS…"
              rows={4}
              className="min-h-[120px] rounded-2xl border-border"
              aria-label="SMS message body"
            />
            <div className="flex justify-end">
              <Button
                type="button"
                className="rounded-xl"
                onClick={submitSms}
              >
                Send SMS (demo)
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="email" className="mt-4 space-y-3">
            <Select onValueChange={applyTemplateEmail}>
              <SelectTrigger className="max-w-sm rounded-xl">
                <SelectValue placeholder="Insert template" />
              </SelectTrigger>
              <SelectContent>
                {EMAIL_TEMPLATES.map((t) => (
                  <SelectItem key={t.label} value={t.label}>
                    {t.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Input
              value={emailSubject}
              onChange={(e) => setEmailSubject(e.target.value)}
              placeholder="Subject line"
              className="rounded-xl"
              aria-label="Email subject"
            />
            <Textarea
              value={emailBody}
              onChange={(e) => setEmailBody(e.target.value)}
              placeholder="Email body"
              rows={8}
              className="min-h-[200px] rounded-2xl border-border"
              aria-label="Email body"
            />
            <p className="text-xs text-muted-foreground">
              Attachments are disabled in Phase 1 — README explains why.
            </p>
            <div className="flex justify-end">
              <Button
                type="button"
                className="rounded-xl"
                onClick={submitEmail}
              >
                Send email (demo)
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="call" className="mt-4">
            <Separator className="mb-4" />
            <CallSimulator candidate={candidate} />
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
}
