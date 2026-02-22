"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { getPatientById } from "@/data/mock-patient";
import { formatDate } from "@/lib/utils";

export default function InstructionsClient({
  id,
  stage: stageId,
}: {
  id: string;
  stage: string;
}) {
  const router = useRouter();
  const patient = getPatientById(id);

  if (!patient) {
    return (
      <div className="animate-fade-in p-6 text-center">
        <p className="text-gray-500">환자 정보를 찾을 수 없습니다.</p>
        <Link href="/" className="text-blue-600 text-sm mt-2 inline-block hover:underline">
          홈으로 돌아가기
        </Link>
      </div>
    );
  }
  const stages = patient.stages;
  const stageIndex = stages.findIndex((s) => s.id === stageId);
  const stage = stages[stageIndex];

  if (!stage) {
    return (
      <div className="animate-fade-in p-6 text-center">
        <p className="text-gray-500">해당 단계를 찾을 수 없습니다.</p>
        <Link href={`/patient/${id}`} className="text-blue-600 text-sm mt-2 inline-block hover:underline">
          대시보드로 돌아가기
        </Link>
      </div>
    );
  }

  const prevStage = stageIndex > 0 ? stages[stageIndex - 1] : null;
  const nextStage = stageIndex < stages.length - 1 ? stages[stageIndex + 1] : null;

  const statusLabel: Record<string, string> = { completed: "완료", current: "현재 단계", upcoming: "예정" };
  const statusColor: Record<string, string> = {
    completed: "bg-green-100 text-green-700",
    current: "bg-blue-100 text-blue-700",
    upcoming: "bg-gray-100 text-gray-600",
  };

  return (
    <div className="animate-fade-in space-y-4 pb-24">
      {/* Back button */}
      <button
        onClick={() => router.back()}
        className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-blue-600 transition-colors -mb-1"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        뒤로가기
      </button>

      {/* Header */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
        <div className="flex items-center gap-2 mb-1">
          <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${statusColor[stage.status]}`}>
            {statusLabel[stage.status]}
          </span>
          {stage.date && <span className="text-[10px] text-gray-400">{formatDate(stage.date)}</span>}
        </div>
        <h1 className="text-lg font-bold text-gray-900">{stage.title}</h1>
        <Link href={`/patient/${id}`} className="text-[10px] text-blue-500 hover:underline mt-1 inline-block">
          대시보드로 이동
        </Link>
      </div>

      {/* Instructions */}
      {stage.instructions.length > 0 && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
          <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
            <svg className="w-3.5 h-3.5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            안내사항
          </h2>
          <ul className="space-y-2">
            {stage.instructions.map((item, i) => (
              <li key={i} className="flex items-start gap-2.5 text-sm text-gray-700">
                <span className="flex-shrink-0 w-5 h-5 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center text-[10px] font-bold">
                  {i + 1}
                </span>
                {item}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Dos & Don'ts side by side */}
      {(stage.dos.length > 0 || stage.donts.length > 0) && (
        <div className="grid grid-cols-2 gap-3">
          {/* Dos */}
          {stage.dos.length > 0 && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
              <h2 className="text-xs font-semibold text-green-600 uppercase tracking-wider mb-2.5 flex items-center gap-1">
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
                해야할 것
              </h2>
              <ul className="space-y-2">
                {stage.dos.map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs">
                    <span className="mt-0.5 w-4 h-4 rounded-full bg-green-100 text-green-600 flex-shrink-0 flex items-center justify-center">
                      <svg className="w-2.5 h-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </span>
                    <span className="text-gray-700">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Don'ts */}
          {stage.donts.length > 0 && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
              <h2 className="text-xs font-semibold text-red-600 uppercase tracking-wider mb-2.5 flex items-center gap-1">
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                </svg>
                하지 말 것
              </h2>
              <ul className="space-y-2">
                {stage.donts.map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs">
                    <span className="mt-0.5 w-4 h-4 rounded-full bg-red-100 text-red-600 flex-shrink-0 flex items-center justify-center">
                      <svg className="w-2.5 h-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </span>
                    <span className="text-gray-700">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* Warnings (toned down) */}
      {stage.warnings.length > 0 && (
        <div className="bg-amber-50/60 border border-amber-100 rounded-2xl p-4">
          <h2 className="text-xs font-semibold text-amber-700 mb-2.5 flex items-center gap-1.5">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            이런 증상이 있으면 병원에 연락하세요
          </h2>
          <ul className="space-y-1.5">
            {stage.warnings.map((w, i) => (
              <li key={i} className="text-xs text-amber-700 flex items-start gap-1.5">
                <span className="text-amber-400 mt-0.5 flex-shrink-0">&bull;</span>
                {w}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* FAQ (outpatient stages) */}
      {stage.faq && stage.faq.length > 0 && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
          <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
            <svg className="w-3.5 h-3.5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            자주 묻는 질문
          </h2>
          <div className="space-y-3">
            {stage.faq.map((item, i) => (
              <div key={i} className="border-b border-gray-50 pb-3 last:border-0 last:pb-0">
                <p className="text-sm font-medium text-gray-800 mb-1">Q. {item.question}</p>
                <p className="text-xs text-gray-600 leading-relaxed">{item.answer}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Navigation */}
      <div className="flex justify-between gap-2">
        {prevStage ? (
          <Link
            href={`/patient/${id}/instructions/${prevStage.id}`}
            className="flex-1 bg-white border border-gray-200 rounded-xl p-2.5 text-center text-sm hover:bg-gray-50 hover:border-blue-200 transition-colors"
          >
            <span className="text-gray-400 text-[10px] block">&larr; 이전</span>
            <span className="text-gray-700 font-medium text-xs">{prevStage.title}</span>
          </Link>
        ) : (
          <Link
            href={`/patient/${id}`}
            className="flex-1 bg-white border border-gray-200 rounded-xl p-2.5 text-center text-sm hover:bg-gray-50 hover:border-blue-200 transition-colors"
          >
            <span className="text-gray-400 text-[10px] block">&larr;</span>
            <span className="text-gray-700 font-medium text-xs">대시보드</span>
          </Link>
        )}
        {nextStage ? (
          <Link
            href={`/patient/${id}/instructions/${nextStage.id}`}
            className="flex-1 bg-white border border-gray-200 rounded-xl p-2.5 text-center text-sm hover:bg-gray-50 hover:border-blue-200 transition-colors"
          >
            <span className="text-gray-400 text-[10px] block">다음 &rarr;</span>
            <span className="text-gray-700 font-medium text-xs">{nextStage.title}</span>
          </Link>
        ) : (
          <Link
            href={`/patient/${id}`}
            className="flex-1 bg-white border border-gray-200 rounded-xl p-2.5 text-center text-sm hover:bg-gray-50 hover:border-blue-200 transition-colors"
          >
            <span className="text-gray-400 text-[10px] block">&rarr;</span>
            <span className="text-gray-700 font-medium text-xs">대시보드</span>
          </Link>
        )}
      </div>
    </div>
  );
}
