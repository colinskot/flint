/** ISO timestamps rendered in UTC for identical SSR vs client output (avoid hydration drift). */
export function formatInstantUtc(iso: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    timeZone: "UTC",
    hour12: true,
  }).format(new Date(iso));
}
