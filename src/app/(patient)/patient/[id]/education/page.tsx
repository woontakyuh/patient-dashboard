import { getAllPatientIds } from "@/data/mock-patient";
import Link from "next/link";

export function generateStaticParams() {
  return getAllPatientIds().map((id) => ({ id }));
}

export default function EducationPage({
  params,
}: {
  params: { id: string };
}) {
  return (
    <div className="animate-fade-in p-6 text-center bg-white rounded-2xl border border-gray-100 shadow-sm">
      <h1 className="text-lg font-bold text-gray-900">서비스 준비 중</h1>
      <p className="text-sm text-gray-500 mt-2">
        교육 자료 기능은 현재 개선 작업 중입니다. 다음 업데이트에서 제공됩니다.
      </p>
      <Link
        href={`/${params.id}`}
        className="inline-flex mt-4 px-4 py-2 rounded-lg bg-teal-500 text-white text-sm font-semibold hover:bg-teal-600 transition-colors"
      >
        대시보드로 돌아가기
      </Link>
    </div>
  );
}
