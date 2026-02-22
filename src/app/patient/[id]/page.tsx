import PageClient from "./PageClient";
import { getAllPatientIds } from "@/data/mock-patient";

export function generateStaticParams() {
  return getAllPatientIds().map((id) => ({ id }));
}

export default function PatientPage({
  params,
}: {
  params: { id: string };
}) {
  return <PageClient id={params.id} />;
}
