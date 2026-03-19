import TimelineClient from "./TimelineClient";
import { getAllPatientIds } from "@/data/mock-patient";

export function generateStaticParams() {
  return getAllPatientIds().map((id) => ({ id }));
}

export default function TimelinePage({
  params,
}: {
  params: { id: string };
}) {
  return <TimelineClient id={params.id} />;
}
