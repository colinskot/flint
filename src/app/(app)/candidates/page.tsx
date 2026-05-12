import { SEED_CANDIDATES } from "@/data/seed";
import { redirect } from "next/navigation";

export default function CandidatesLandingPage() {
  redirect(`/candidates/${SEED_CANDIDATES[0].id}`);
}
