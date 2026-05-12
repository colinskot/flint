import { AppShell } from "@/components/layout/app-shell";
import { TopBar } from "@/components/layout/top-bar";

export default function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex h-[100dvh] flex-col bg-background overflow-hidden">
      <TopBar />
      <AppShell>{children}</AppShell>
    </div>
  );
}
