import { CandidateSidebar } from "@/components/candidates/candidate-sidebar";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-0 flex-1">
      <CandidateSidebar className="hidden w-[min(100%,20rem)] shrink-0 md:flex lg:w-[22rem]" />
      <div className="flex min-h-0 min-w-0 flex-1 flex-col">{children}</div>
    </div>
  );
}
