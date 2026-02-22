import ProgressClient from "./ProgressClient";

export function generateStaticParams() {
  return [{ id: "P001" }];
}

export default function ProgressPage() {
  return <ProgressClient />;
}
