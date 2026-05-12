import { CandidateWorkspace } from "@/components/candidates/candidate-workspace";
import { SEED_CANDIDATES } from "@/data/seed";
import { notFound } from "next/navigation";

export default async function CandidatePage({
  params,
}: {
  params: Promise<{ candidateId: string }>;
}) {
  const { candidateId } = await params;
  const candidate = SEED_CANDIDATES.find((c) => c.id === candidateId);
  if (!candidate) notFound();
  return <CandidateWorkspace candidate={candidate} />;
}
