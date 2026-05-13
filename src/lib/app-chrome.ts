/** Routes where the recruiter shell hides the sidebar and mobile sidebar trigger (matches /candidates list). */
export function usesStandaloneCandidateChrome(pathname: string): boolean {
  const p =
    pathname.length > 1 && pathname.endsWith("/") ? pathname.slice(0, -1) : pathname;
  if (p === "/candidates") return true;
  if (p === "/design-system") return true;
  return false;
}
