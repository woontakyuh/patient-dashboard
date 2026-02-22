import InstructionsClient from "./InstructionsClient";

export function generateStaticParams() {
  const stages = ["pre-op", "surgery-day", "pod1", "discharge", "fu-2w", "fu-6w", "fu-3m", "fu-6m", "fu-1y"];
  return stages.map((stage) => ({ id: "P001", stage }));
}

export default function InstructionsPage({
  params,
}: {
  params: { id: string; stage: string };
}) {
  return <InstructionsClient id={params.id} stage={params.stage} />;
}
