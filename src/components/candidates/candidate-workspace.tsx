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
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="shrink-0 space-y-3 px-4 pt-3 md:space-y-4 md:px-6 md:pt-4">
        <CandidateOverview candidate={candidate} />
        <RecruiterAiToolkit candidate={candidate} messages={messages} />
      </div>
      <ThreadTimeline candidate={candidate} messages={messages} />
      {/* Cap composer height on small screens so the thread keeps ~≥50% of the viewport */}
      <div className="shrink-0 max-md:max-h-[min(50dvh,420px)] max-md:overflow-y-auto max-md:overflow-x-hidden">
        <UnifiedComposer candidate={candidate} />
      </div>
    </div>
  );
}
