import type { Candidate, CandidateStatus } from "@/lib/types";
import { SEED_CANDIDATES } from "@/data/seed";

export type CandidatesListSort =
  | "last_touch_desc"
  | "last_touch_asc"
  | "name_asc"
  | "name_desc"
  | "specialty_asc"
  | "license_asc";

export const CANDIDATES_SORT_LABELS: Record<CandidatesListSort, string> = {
  last_touch_desc: "Last updated · newest",
  last_touch_asc: "Last updated · oldest",
  name_asc: "Name · A → Z",
  name_desc: "Name · Z → A",
  specialty_asc: "Specialty · A → Z",
  license_asc: "License state · A → Z",
};

export interface CandidatesListCriteria {
  query: string;
  status: CandidateStatus | "all";
  /** Use `"all"` to disable filtering. */
  specialty: string;
  /** Use `"all"` to disable filtering. */
  licenseState: string;
  sort: CandidatesListSort;
}

export const DEFAULT_CANDIDATES_LIST_CRITERIA = {
  query: "",
  status: "all",
  specialty: "all",
  licenseState: "all",
  sort: "last_touch_desc",
} as const satisfies Omit<CandidatesListCriteria, "query"> & { query: string };

export function candidatesFilterOptions(): {
  specialties: string[];
  licenseStates: string[];
} {
  const specialties = [...new Set(SEED_CANDIDATES.map((c) => c.specialty))].sort((a, b) =>
    a.localeCompare(b),
  );
  const licenseStates = [...new Set(SEED_CANDIDATES.map((c) => c.licenseState))].sort((a, b) =>
    a.localeCompare(b),
  );
  return { specialties, licenseStates };
}

export function filterSortCandidates(criteria: CandidatesListCriteria): Candidate[] {
  const needle = criteria.query.trim().toLowerCase();
  const rows = SEED_CANDIDATES.filter((c) => {
    if (criteria.status !== "all" && c.status !== criteria.status) return false;
    if (criteria.specialty !== "all" && c.specialty !== criteria.specialty) return false;
    if (criteria.licenseState !== "all" && c.licenseState !== criteria.licenseState) return false;
    if (!needle) return true;
    const blob =
      `${c.firstName} ${c.lastName} ${c.specialty} ${c.licenseState} ${c.email} ${c.timezone}`.toLowerCase();
    return blob.includes(needle);
  });

  return [...rows].sort((a, b) => {
    switch (criteria.sort) {
      case "last_touch_desc":
        return b.lastTouchAt.localeCompare(a.lastTouchAt);
      case "last_touch_asc":
        return a.lastTouchAt.localeCompare(b.lastTouchAt);
      case "name_asc": {
        const ln = a.lastName.localeCompare(b.lastName);
        if (ln !== 0) return ln;
        return a.firstName.localeCompare(b.firstName);
      }
      case "name_desc": {
        const ln = b.lastName.localeCompare(a.lastName);
        if (ln !== 0) return ln;
        return b.firstName.localeCompare(a.firstName);
      }
      case "specialty_asc":
        return a.specialty.localeCompare(b.specialty);
      case "license_asc":
        return a.licenseState.localeCompare(b.licenseState);
      default: {
        const _exhaustive: never = criteria.sort;
        return _exhaustive;
      }
    }
  });
}
