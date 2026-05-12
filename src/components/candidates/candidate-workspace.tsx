"use client";

import type { Candidate } from "@/lib/types";
import { usePortal } from "@/context/portal-context";
import { ThreadTimeline } from "@/components/thread/thread-timeline";
import { UnifiedComposer } from "@/components/composer/unified-composer";

export function CandidateWorkspace({ candidate }: { candidate: Candidate }) {
  const { messagesFor } = usePortal();
  const messages = messagesFor(candidate.id);

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <ThreadTimeline candidate={candidate} messages={messages} />
      <UnifiedComposer candidate={candidate} />
    </div>
  );
}
