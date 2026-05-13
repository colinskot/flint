import type { Metadata } from "next";
import { DesignSystemGallery } from "@/components/design/design-system-gallery";

export const metadata: Metadata = {
  title: "Design system · Flint recruiter demo",
  description:
    "Visible Flint palette specimens, typography, and reusable UI primitives for Phase 1.",
};

export default function DesignSystemPage() {
  return <DesignSystemGallery />;
}
