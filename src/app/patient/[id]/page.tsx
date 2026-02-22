import PageClient from "./PageClient";

export function generateStaticParams() {
  return [{ id: "P001" }];
}

export default function PatientPage() {
  return <PageClient />;
}
