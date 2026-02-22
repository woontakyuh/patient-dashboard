import PromClient from "./PromClient";

export function generateStaticParams() {
  return [{ id: "P001" }];
}

export default function PromPage() {
  return <PromClient />;
}
