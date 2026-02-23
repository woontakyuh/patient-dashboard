import ChatClient from "./ChatClient";
import { getAllPatientIds } from "@/data/mock-patient";

export function generateStaticParams() {
  return getAllPatientIds().map((id) => ({ id }));
}

export default function ChatPage({
  params,
}: {
  params: { id: string };
}) {
  return <ChatClient id={params.id} />;
}
