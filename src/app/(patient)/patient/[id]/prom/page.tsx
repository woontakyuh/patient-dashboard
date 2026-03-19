import PromClient from "./PromClient";
import { getAllPatientIds } from "@/data/mock-patient";

export function generateStaticParams() {
  return getAllPatientIds().map((id) => ({ id }));
}

export default function PromPage({
  params,
}: {
  params: { id: string };
}) {
  return <PromClient id={params.id} />;
}
