import EducationClient from "./EducationClient";
import { getAllPatientIds } from "@/data/mock-patient";

export function generateStaticParams() {
  return getAllPatientIds().map((id) => ({ id }));
}

export default function EducationPage({
  params,
}: {
  params: { id: string };
}) {
  return <EducationClient id={params.id} />;
}
