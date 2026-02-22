import InstructionsClient from "./InstructionsClient";
import { getAllPatientIds, getPatientById } from "@/data/mock-patient";

export function generateStaticParams() {
  const params: { id: string; stage: string }[] = [];
  for (const id of getAllPatientIds()) {
    const patient = getPatientById(id);
    if (!patient) continue;
    for (const stage of patient.stages) {
      params.push({ id, stage: stage.id });
    }
  }
  return params;
}

export default function InstructionsPage({
  params,
}: {
  params: { id: string; stage: string };
}) {
  return <InstructionsClient id={params.id} stage={params.stage} />;
}
