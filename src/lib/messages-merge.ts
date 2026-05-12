import type { TimelineMessage } from "@/lib/types";

export function sortMessages(messages: TimelineMessage[]) {
  return [...messages].sort(
    (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
  );
}

export function messagesForCandidate(
  candidateId: string,
  seed: TimelineMessage[],
  userStored: TimelineMessage[],
) {
  const merged = [...seed, ...userStored].filter(
    (m) => m.candidateId === candidateId,
  );
  return sortMessages(merged);
}

export function candidateIdsFromMerged(
  seed: TimelineMessage[],
  userStored: TimelineMessage[],
): Set<string> {
  const ids = new Set<string>();
  [...seed, ...userStored].forEach((m) => ids.add(m.candidateId));
  return ids;
}
