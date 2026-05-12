"use client";

import type { Candidate } from "@/lib/types";
import { usePortal } from "@/context/portal-context";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { useCallback, useEffect, useState } from "react";

type CallPhase = "idle" | "ringing" | "active" | "ended";

export function CallSimulator({ candidate }: { candidate: Candidate }) {
  const { appendMessage } = usePortal();
  const [digits, setDigits] = useState("");
  const [phase, setPhase] = useState<CallPhase>("idle");
  const [elapsed, setElapsed] = useState(0);
  const [notes, setNotes] = useState("");
  const [disposition, setDisposition] = useState<
    "answered" | "voicemail" | "no_answer" | "busy"
  >("answered");

  useEffect(() => {
    if (phase !== "active") return;
    const id = window.setInterval(() => setElapsed((s) => s + 1), 1000);
    return () => window.clearInterval(id);
  }, [phase]);

  const press = (d: string) => {
    if (phase !== "idle" && phase !== "ringing") return;
    setDigits((prev) => (prev + d).slice(0, 16));
  };

  const startRing = useCallback(() => {
    setElapsed(0);
    setNotes("");
    setPhase("ringing");
    toast.message("Dialing candidate (demo)…");
    window.setTimeout(() => {
      setPhase((p) => (p === "ringing" ? "active" : p));
      toast.success("Connected (simulated)");
    }, 1400);
  }, []);

  const endCall = useCallback(() => {
    appendMessage({
      id: crypto.randomUUID(),
      candidateId: candidate.id,
      kind: "call",
      direction: "outbound",
      createdAt: new Date().toISOString(),
      disposition,
      durationSec: elapsed,
      callNotes: notes.trim() || undefined,
    });
    setPhase("ended");
    toast.success("Call logged to timeline");
    window.setTimeout(() => {
      setPhase("idle");
      setDigits("");
      setElapsed(0);
    }, 800);
  }, [appendMessage, candidate.id, disposition, elapsed, notes]);

  const grid = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "*", "0", "#"];

  return (
    <div className="grid gap-4 md:grid-cols-[1fr_1.1fr]">
      <Card className="rounded-2xl border-border p-4">
        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          Soft phone (simulated)
        </p>
        <p className="mt-2 font-mono text-lg tracking-widest text-foreground">
          {candidate.phoneDisplay}
        </p>
        <p className="mt-1 text-xs text-muted-foreground">
          Extension / IVR: <span className="font-mono">{digits || "—"}</span>
        </p>
        <div className="mt-4 grid grid-cols-3 gap-2">
          {grid.map((d) => (
            <Button
              key={d}
              type="button"
              variant="outline"
              className="h-11 rounded-2xl text-base"
              onClick={() => press(d)}
              disabled={phase === "active" || phase === "ended"}
            >
              {d}
            </Button>
          ))}
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          <Button
            type="button"
            className="rounded-xl"
            disabled={phase === "ringing" || phase === "active"}
            onClick={startRing}
          >
            {phase === "ringing"
              ? "Connecting…"
              : phase === "active"
                ? "In progress"
                : "Start call"}
          </Button>
          <Button
            type="button"
            variant="secondary"
            className="rounded-xl"
            disabled={phase !== "active"}
            onClick={endCall}
          >
            End & log call
          </Button>
          <Button
            type="button"
            variant="ghost"
            className="rounded-xl"
            onClick={() => {
              setDigits("");
              setNotes("");
              setElapsed(0);
              setPhase("idle");
            }}
          >
            Reset keypad
          </Button>
        </div>
      </Card>
      <Card className="rounded-2xl border-border p-4">
        <Label className="text-xs uppercase tracking-wide text-muted-foreground">
          Disposition & notes
        </Label>
        <Select
          value={disposition}
          onValueChange={(v: typeof disposition) => setDisposition(v)}
        >
          <SelectTrigger className="mt-2 rounded-xl">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="answered">Answered</SelectItem>
            <SelectItem value="voicemail">Voicemail</SelectItem>
            <SelectItem value="no_answer">No answer</SelectItem>
            <SelectItem value="busy">Busy</SelectItem>
          </SelectContent>
        </Select>
        <Textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Disposition notes visible on the timeline…"
          className="mt-3 rounded-2xl"
          rows={5}
          aria-label="Call notes"
        />
        <p className="mt-3 text-xs text-muted-foreground">
          Timer: {Math.floor(elapsed / 60)}:
          {String(elapsed % 60).padStart(2, "0")} · Phase: {phase}
        </p>
      </Card>
    </div>
  );
}
