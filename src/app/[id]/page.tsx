import PageClient from "@/app/patient/[id]/PageClient";
import { getAllPatientIds } from "@/data/mock-patient";

export function generateStaticParams() {
  return getAllPatientIds().map((id) => ({ id }));
}

export default function ShortPatientPage({
  params,
}: {
  params: { id: string };
}) {
  return <PageClient id={params.id} />;
}
