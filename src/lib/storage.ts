import type { TimelineMessage } from "@/lib/types";

const STORAGE_KEY = "flint-recruiter-timeline-v1";
export const STORAGE_EVENT = "flint-recruiter-timeline";

function dispatch() {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new Event(STORAGE_EVENT));
}

function safeParse(raw: string | null): TimelineMessage[] | null {
  if (!raw) return null;
  try {
    const data = JSON.parse(raw) as unknown;
    if (!Array.isArray(data)) return null;
    return data as TimelineMessage[];
  } catch {
    return null;
  }
}

/** Cached snapshot for useSyncExternalStore — must reuse same references until underlying storage mutates */
let cachedSerializedKey: string | undefined;
let cachedMessages: TimelineMessage[] = [];

function readAndCacheFromDOM(): TimelineMessage[] {
  if (typeof window === "undefined") return [];
  const raw = window.localStorage.getItem(STORAGE_KEY);
  const serializedKey = raw ?? "__EMPTY__";

  if (serializedKey !== cachedSerializedKey) {
    cachedSerializedKey = serializedKey;
    cachedMessages = raw ? (safeParse(raw) ?? []) : [];
  }

  return cachedMessages;
}

export function subscribeUserTimeline(onStoreChange: () => void) {
  if (typeof window === "undefined") return () => {};
  const handler = () => onStoreChange();
  window.addEventListener(STORAGE_EVENT, handler);
  return () => window.removeEventListener(STORAGE_EVENT, handler);
}

export function loadUserMessages(): TimelineMessage[] {
  return readAndCacheFromDOM();
}

export function persistUserMessages(messages: TimelineMessage[]) {
  if (typeof window === "undefined") return;
  const serialized = JSON.stringify(messages);
  window.localStorage.setItem(STORAGE_KEY, serialized);
  cachedSerializedKey = serialized;
  cachedMessages = messages;
  dispatch();
}

export function clearDemoStorage() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(STORAGE_KEY);
  cachedSerializedKey = "__EMPTY__";
  cachedMessages = [];
  dispatch();
}
