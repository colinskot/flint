"use client";

import type { Candidate } from "@/lib/types";
import { usePortal } from "@/context/portal-context";
import { ThreadTimeline } from "@/components/thread/thread-timeline";
import { UnifiedComposer } from "@/components/composer/unified-composer";
import { RecruiterAiToolkit } from "@/components/ai/recruiter-ai-toolkit";
import { CandidateOverview } from "@/components/candidates/candidate-overview";

export function CandidateWorkspace({ candidate }: { candidate: Candidate }) {
  const { messagesFor } = usePortal();
  const messages = messagesFor(candidate.id);

  return (
    <div className="flex min-h-0 flex-1 flex-col px-4 pt-3 pb-3 md:px-6 md:pt-4 md:pb-4">
      <div
        className="flex min-h-0 flex-1 flex-col divide-y divide-border overflow-hidden rounded-2xl border border-border bg-card shadow-sm"
      >
        <CandidateOverview
          candidate={candidate}
          actions={<RecruiterAiToolkit candidate={candidate} messages={messages} />}
        />
        <ThreadTimeline messages={messages} />
        {/* Cap composer height on small screens so the thread keeps ~≥50% of the viewport */}
        <div className="shrink-0 max-md:max-h-[min(50dvh,420px)] max-md:overflow-y-auto max-md:overflow-x-hidden">
          <UnifiedComposer candidate={candidate} />
        </div>
      </div>
    </div>
  );
}
