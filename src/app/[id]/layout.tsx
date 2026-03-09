import type { ReactNode } from "react";
import PatientAccessGate from "@/components/auth/PatientAccessGate";

export default function ShortPatientLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: { id: string };
}) {
  return <PatientAccessGate patientId={params.id}>{children}</PatientAccessGate>;
}
