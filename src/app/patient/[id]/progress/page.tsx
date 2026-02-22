import ProgressClient from "./ProgressClient";
import { getAllPatientIds } from "@/data/mock-patient";

export function generateStaticParams() {
  return getAllPatientIds().map((id) => ({ id }));
}

export default function ProgressPage({
  params,
}: {
  params: { id: string };
}) {
  return <ProgressClient id={params.id} />;
}
