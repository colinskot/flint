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
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import {
  Loader2,
  Sparkles,
  Phone,
  Mail,
  MessageSquare,
  SendHorizontal,
  SlidersHorizontal,
} from "lucide-react";
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
  const [draftSheetOpen, setDraftSheetOpen] = useState(false);
  const [callSheetOpen, setCallSheetOpen] = useState(false);

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
        setDraftSheetOpen(false);
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
        setDraftSheetOpen(false);
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

  const pickChannel = useCallback((tab: string) => {
    setActiveTab(tab);
    if (tab === "call") {
      setCallSheetOpen(true);
    } else {
      setCallSheetOpen(false);
    }
  }, []);

  return (
    <div className="bg-card">
      {/* Mobile: single-line-style input row; tone/templates/AI live in a sheet; call uses a keypad sheet */}
      <div className="px-3 pt-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] md:hidden">
        <div className="flex gap-0.5 rounded-xl bg-muted/80 p-[3px]">
          {(
            [
              { id: "sms", label: "SMS", Icon: MessageSquare },
              { id: "email", label: "Email", Icon: Mail },
              { id: "call", label: "Call", Icon: Phone },
            ] as const
          ).map(({ id, label, Icon }) => (
            <button
              key={id}
              type="button"
              onClick={() => { pickChannel(id); }}
              className={cn(
                "flex flex-1 items-center justify-center gap-1 rounded-lg py-1.5 text-xs font-medium transition-colors",
                activeTab === id
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              <Icon className="size-3.5 shrink-0" aria-hidden />
              {label}
            </button>
          ))}
        </div>

        {activeTab === "call" ? (
          <p className="mt-2 px-0.5 text-center text-[11px] leading-snug text-muted-foreground">
            Soft phone opens in the sheet below. Close it when you&apos;re done
            logging the call.
          </p>
        ) : (
          <>
            {activeTab === "email" && (
              <Input
                value={emailSubject}
                onChange={(e) => { setEmailSubject(e.target.value); }}
                placeholder="Subject"
                className="mt-2 rounded-xl"
                aria-label="Email subject"
              />
            )}
            <Sheet open={draftSheetOpen} onOpenChange={setDraftSheetOpen}>
              <div className="mt-2 flex items-end gap-2">
              <SheetTrigger asChild>
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  className="size-10 shrink-0 rounded-xl"
                  aria-label="Draft tools: tone, templates, AI"
                >
                  <Sparkles className="size-4" aria-hidden />
                </Button>
              </SheetTrigger>
              {activeTab === "sms" ? (
                <Textarea
                  value={smsBody}
                  onChange={(e) => { setSmsBody(e.target.value); }}
                  placeholder="Message…"
                  rows={1}
                  className="max-h-[132px] min-h-[44px] flex-1 resize-none rounded-2xl border-border text-sm leading-snug field-sizing-content"
                  aria-label="SMS message body"
                />
              ) : (
                <Textarea
                  value={emailBody}
                  onChange={(e) => { setEmailBody(e.target.value); }}
                  placeholder="Write email…"
                  rows={3}
                  className="max-h-[160px] min-h-[72px] flex-1 resize-none rounded-2xl border-border text-sm leading-snug"
                  aria-label="Email body"
                />
              )}
              <Button
                type="button"
                size="icon"
                className="size-10 shrink-0 rounded-xl"
                onClick={activeTab === "sms" ? submitSms : submitEmail}
                aria-label={activeTab === "sms" ? "Send SMS" : "Send email"}
              >
                <SendHorizontal className="size-4" aria-hidden />
              </Button>
            </div>
            <SheetContent
              side="bottom"
              className="flex max-h-[min(85dvh,640px)] flex-col gap-0 overflow-hidden"
            >
              <SheetHeader className="border-b border-border pb-3 text-left">
                <SheetTitle>Draft tools</SheetTitle>
                <SheetDescription>
                  Tone affects AI drafts. Templates fill the composer; you can
                  edit before sending.
                </SheetDescription>
              </SheetHeader>
              <div className="min-h-0 flex-1 overflow-y-auto px-4 py-4">
                <div className="space-y-2">
                  <Label className="text-xs uppercase tracking-wide text-muted-foreground">
                    Draft tone (AI)
                  </Label>
                  <RadioGroup
                    value={tone}
                    onValueChange={(v: MessageTone) => { setTone(v); }}
                    className="flex flex-wrap gap-x-4 gap-y-2"
                  >
                    <div className="flex items-center gap-2">
                      <RadioGroupItem id="tone-pro-m" value="professional" />
                      <Label htmlFor="tone-pro-m" className="text-sm font-normal">
                        Professional
                      </Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <RadioGroupItem id="tone-fr-m" value="friendly" />
                      <Label htmlFor="tone-fr-m" className="text-sm font-normal">
                        Friendly
                      </Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <RadioGroupItem id="tone-urg-m" value="urgent" />
                      <Label htmlFor="tone-urg-m" className="text-sm font-normal">
                        Urgent
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

                <div className="mt-4 space-y-2">
                  {activeTab === "sms" ? (
                    <>
                      <Label className="text-xs text-muted-foreground">
                        Template
                      </Label>
                      <Select onValueChange={applyTemplateSms}>
                        <SelectTrigger className="w-full rounded-xl">
                          <SelectValue placeholder="Insert SMS template" />
                        </SelectTrigger>
                        <SelectContent>
                          {SMS_TEMPLATES.map((t) => (
                            <SelectItem key={t.label} value={t.label}>
                              {t.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <p className="text-xs text-muted-foreground">
                        ~{smsMeta.segments} segment
                        {smsMeta.segments === 1 ? "" : "s"} ({smsMeta.segSize}
                        -char units)
                      </p>
                    </>
                  ) : (
                    <>
                      <Label className="text-xs text-muted-foreground">
                        Template
                      </Label>
                      <Select onValueChange={applyTemplateEmail}>
                        <SelectTrigger className="w-full rounded-xl">
                          <SelectValue placeholder="Insert email template" />
                        </SelectTrigger>
                        <SelectContent>
                          {EMAIL_TEMPLATES.map((t) => (
                            <SelectItem key={t.label} value={t.label}>
                              {t.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <p className="text-xs text-muted-foreground">
                        Attachments are disabled in Phase 1.
                      </p>
                    </>
                  )}
                </div>

                <Button
                  type="button"
                  variant="secondary"
                  className="mt-6 w-full rounded-xl gap-2"
                  onClick={() => void runAiAssist()}
                  disabled={aiBusy}
                >
                  {aiBusy ? (
                    <Loader2 className="size-4 animate-spin" aria-hidden />
                  ) : (
                    <Sparkles className="size-4" aria-hidden />
                  )}
                  AI draft ({activeTab === "sms" ? "SMS" : "Email"})
                </Button>
              </div>
            </SheetContent>
          </Sheet>
          </>
        )}
      </div>

      <Sheet
        open={callSheetOpen}
        onOpenChange={(open) => {
          setCallSheetOpen(open);
          if (!open) {
            setActiveTab((prev) => (prev === "call" ? "sms" : prev));
          }
        }}
      >
        <SheetContent
          side="bottom"
          className="flex max-h-[min(92dvh,820px)] flex-col gap-0 overflow-hidden px-0 pt-4 md:hidden"
        >
          <SheetHeader className="px-4 text-left">
            <SheetTitle>Call simulator</SheetTitle>
            <SheetDescription>
              Demo only — nothing is actually dialed.
            </SheetDescription>
          </SheetHeader>
          <div className="min-h-0 flex-1 overflow-y-auto px-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
            <CallSimulator candidate={candidate} />
          </div>
        </SheetContent>
      </Sheet>

      {/* Tablet/desktop — compact footprint (mobile-inspired spacing) */}
      <div className="hidden px-4 py-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] md:block md:px-5 md:py-3 md:pb-3">
      <div className="mb-1.5 flex flex-wrap items-center justify-between gap-2 md:mb-2">
        <div className="min-w-0 flex-1 basis-[min(100%,12rem)] leading-tight">
          <p className="text-sm font-semibold text-foreground">Composer</p>
          <p
            className="truncate text-xs text-muted-foreground"
            title={`${candidate.phoneDisplay} · ${candidate.email}`}
          >
            {candidate.phoneDisplay} · {candidate.email}
          </p>
        </div>
        <div
          data-slot="button-group"
          role="group"
          aria-label="Draft tools"
          className="inline-flex shrink-0 items-stretch divide-x divide-border overflow-hidden rounded-lg border border-border bg-background shadow-sm md:rounded-xl"
        >
          <Popover>
            <PopoverTrigger asChild>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="h-8 gap-1.5 rounded-none rounded-l-lg border-0 px-2.5 text-xs shadow-none md:h-9 md:gap-2 md:rounded-l-xl md:px-3 md:text-sm"
              >
                <SlidersHorizontal className="size-3.5 md:size-4" aria-hidden />
                Draft options
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 space-y-4" align="end">
              <div className="space-y-2">
                <Label className="text-[10px] uppercase tracking-wide text-muted-foreground">
                  Draft tone (AI)
                </Label>
                <RadioGroup
                  value={tone}
                  onValueChange={(v: MessageTone) => {
                    setTone(v);
                  }}
                  className="flex flex-col gap-2"
                >
                  <div className="flex items-center gap-2">
                    <RadioGroupItem id="tone-pro-pop" value="professional" />
                    <Label htmlFor="tone-pro-pop" className="text-sm font-normal">
                      Professional
                    </Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <RadioGroupItem id="tone-fr-pop" value="friendly" />
                    <Label htmlFor="tone-fr-pop" className="text-sm font-normal">
                      Friendly
                    </Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <RadioGroupItem id="tone-urg-pop" value="urgent" />
                    <Label htmlFor="tone-urg-pop" className="text-sm font-normal">
                      Urgent
                    </Label>
                  </div>
                </RadioGroup>
              </div>
              <Separator />
              {activeTab === "sms" ? (
                <div className="space-y-2">
                  <Label className="text-xs text-muted-foreground">Template</Label>
                  <Select onValueChange={applyTemplateSms}>
                    <SelectTrigger className="w-full rounded-xl">
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
                  <p className="text-[11px] text-muted-foreground">
                    ~{smsMeta.segments} segment{smsMeta.segments === 1 ? "" : "s"} ({smsMeta.segSize}-char units)
                  </p>
                </div>
              ) : null}
              {activeTab === "email" ? (
                <div className="space-y-2">
                  <Label className="text-xs text-muted-foreground">Template</Label>
                  <Select onValueChange={applyTemplateEmail}>
                    <SelectTrigger className="w-full rounded-xl">
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
                  <p className="text-[11px] leading-snug text-muted-foreground">
                    Attachments are disabled in Phase 1 — README explains why.
                  </p>
                </div>
              ) : null}
              {activeTab === "call" ? (
                <p className="text-xs text-muted-foreground">
                  Switch to SMS or Email to pick templates and tone for AI drafts.
                </p>
              ) : null}
            </PopoverContent>
          </Popover>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="h-8 gap-1 rounded-none rounded-r-lg border-0 px-2.5 text-xs shadow-none md:h-9 md:rounded-r-xl md:px-3 md:text-sm"
                onClick={runAiAssist}
                disabled={aiBusy}
              >
                {aiBusy ? (
                  <Loader2 className="size-3.5 animate-spin md:size-4" aria-hidden />
                ) : (
                  <Sparkles className="size-3.5 md:size-4" aria-hidden />
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

      <Card className="rounded-xl border-border/80 bg-muted/40 gap-2 p-2.5 shadow-none md:rounded-2xl md:p-3">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid h-8 w-full grid-cols-3 gap-0 rounded-lg bg-muted/80 p-[2px] md:h-9 md:rounded-xl md:p-[3px]">
            <TabsTrigger
              value="sms"
              className="rounded-md px-2 py-0 text-xs md:rounded-lg md:text-sm"
            >
              SMS
            </TabsTrigger>
            <TabsTrigger
              value="email"
              className="rounded-md px-2 py-0 text-xs md:rounded-lg md:text-sm"
            >
              Email
            </TabsTrigger>
            <TabsTrigger
              value="call"
              className="gap-1 rounded-md px-2 py-0 text-xs md:rounded-lg md:gap-1.5 md:text-sm"
            >
              <Phone className="size-3 md:size-3.5" aria-hidden />
              Call
            </TabsTrigger>
          </TabsList>

          <TabsContent value="sms" className="mt-2 space-y-2 md:mt-2.5">
            <p className="hidden text-[11px] text-muted-foreground md:block">
              Templates & tone live in <span className="font-medium text-foreground">Draft options</span>.
            </p>
            <Textarea
              value={smsBody}
              onChange={(e) => { setSmsBody(e.target.value); }}
              placeholder="Write a concise SMS…"
              rows={2}
              className="min-h-[72px] rounded-xl border-border py-2.5 text-sm leading-snug md:min-h-[88px] md:rounded-2xl"
              aria-label="SMS message body"
            />
            <div className="flex justify-end">
              <Button
                type="button"
                className="h-8 rounded-lg px-3 text-xs md:h-9 md:rounded-xl md:text-sm"
                onClick={submitSms}
              >
                Send SMS (demo)
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="email" className="mt-2 space-y-2 md:mt-2.5">
            <p className="hidden text-[11px] text-muted-foreground md:block">
              Templates & tone live in <span className="font-medium text-foreground">Draft options</span>.
            </p>
            <Input
              value={emailSubject}
              onChange={(e) => { setEmailSubject(e.target.value); }}
              placeholder="Subject line"
              className="rounded-xl"
              aria-label="Email subject"
            />
            <Textarea
              value={emailBody}
              onChange={(e) => { setEmailBody(e.target.value); }}
              placeholder="Email body"
              rows={4}
              className="min-h-[120px] rounded-xl border-border py-2.5 text-sm leading-snug md:min-h-[150px] md:rounded-2xl"
              aria-label="Email body"
            />
            <div className="flex justify-end">
              <Button
                type="button"
                className="h-8 rounded-lg px-3 text-xs md:h-9 md:rounded-xl md:text-sm"
                onClick={submitEmail}
              >
                Send email (demo)
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="call" className="mt-2 space-y-2 md:mt-2.5">
            <Separator className="mb-2 md:mb-2.5" />
            <CallSimulator candidate={candidate} />
          </TabsContent>
        </Tabs>
      </Card>
      </div>
    </div>
  );
}
