import TimelineClient from "./TimelineClient";

export function generateStaticParams() {
  return [{ id: "P001" }];
}

export default function TimelinePage() {
  return <TimelineClient />;
}
