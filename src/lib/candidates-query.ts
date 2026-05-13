import type { Candidate } from "@/lib/types";
import { SEED_CANDIDATES } from "@/data/seed";

export function filterSortCandidates(query: string): Candidate[] {
  const needle = query.trim().toLowerCase();
  return SEED_CANDIDATES.filter((c) => {
    if (!needle) return true;
    const blob =
      `${c.firstName} ${c.lastName} ${c.specialty} ${c.licenseState} ${c.email}`.toLowerCase();
    return blob.includes(needle);
  }).sort((a, b) => b.lastTouchAt.localeCompare(a.lastTouchAt));
}
