"use client";

import type { TimelineMessage } from "@/lib/types";
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useSyncExternalStore,
} from "react";
import {
  clearDemoStorage,
  loadUserMessages,
  persistUserMessages,
  subscribeUserTimeline,
} from "@/lib/storage";
import { messagesForCandidate } from "@/lib/messages-merge";

interface PortalContextValue {
  seedTimeline: TimelineMessage[];
  userMessages: TimelineMessage[];
  allMessages: TimelineMessage[];
  messagesFor: (candidateId: string) => TimelineMessage[];
  appendMessage: (msg: TimelineMessage) => void;
  resetDemo: () => void;
}

const PortalContext = createContext<PortalContextValue | null>(null);

const EMPTY_STORE_SNAPSHOT: TimelineMessage[] = [];

export function PortalProvider({
  children,
  seedTimeline,
}: {
  children: React.ReactNode;
  seedTimeline: TimelineMessage[];
}) {
  const userMessages = useSyncExternalStore(
    subscribeUserTimeline,
    loadUserMessages,
    () => EMPTY_STORE_SNAPSHOT,
  );

  const allMessages = useMemo(
    () => [...seedTimeline, ...userMessages],
    [seedTimeline, userMessages],
  );

  const messagesForCb = useCallback(
    (candidateId: string) =>
      messagesForCandidate(candidateId, seedTimeline, userMessages),
    [seedTimeline, userMessages],
  );

  const appendMessage = useCallback((msg: TimelineMessage) => {
    const next = [...loadUserMessages(), msg];
    persistUserMessages(next);
  }, []);

  const resetDemo = useCallback(() => {
    clearDemoStorage();
  }, []);

  const value = useMemo<PortalContextValue>(
    () => ({
      seedTimeline,
      userMessages,
      allMessages,
      messagesFor: messagesForCb,
      appendMessage,
      resetDemo,
    }),
    [
      seedTimeline,
      userMessages,
      allMessages,
      messagesForCb,
      appendMessage,
      resetDemo,
    ],
  );

  return (
    <PortalContext.Provider value={value}>{children}</PortalContext.Provider>
  );
}

export function usePortal() {
  const ctx = useContext(PortalContext);
  if (!ctx) throw new Error("usePortal must be used within PortalProvider");
  return ctx;
}
