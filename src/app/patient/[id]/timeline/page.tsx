"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { mockPatient } from "@/data/mock-patient";
import { formatDate } from "@/lib/utils";

export default function TimelinePage() {
  const router = useRouter();
  const patient = mockPatient;
  const currentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (currentRef.current) {
      currentRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, []);

  const inpatient = patient.stages.filter((s) => s.phase === "inpatient");
  const outpatient = patient.stages.filter((s) => s.phase === "outpatient");

  function statusNode(status: string) {
    if (status === "completed") {
      return (
        <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center text-white flex-shrink-0">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
          </svg>
        </div>
      );
    }
    if (status === "current") {
      return (
        <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white animate-pulse-ring flex-shrink-0">
          <div className="w-2.5 h-2.5 rounded-full bg-white" />
        </div>
      );
    }
    return (
      <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-400 flex-shrink-0">
        <div className="w-2.5 h-2.5 rounded-full bg-gray-400" />
      </div>
    );
  }

  return (
    <div className="animate-fade-in pb-24">
      <button
        onClick={() => router.back()}
        className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-blue-600 transition-colors mb-3"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        뒤로가기
      </button>

      <h1 className="text-xl font-bold text-gray-900 mb-4 px-1">수술 여정 타임라인</h1>

      {/* Inpatient section */}
      <div className="mb-6">
        <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 px-1">입원 기간</h2>
        {inpatient.map((stage, i) => {
          const isLast = i === inpatient.length - 1;
          const isCurrent = stage.status === "current";
          return (
            <div key={stage.id} className="flex" ref={isCurrent ? currentRef : undefined}>
              <div className="flex flex-col items-center mr-3">
                <Link href={`/patient/${patient.id}/instructions/${stage.id}`}>
                  {statusNode(stage.status)}
                </Link>
                {!isLast && (
                  <div className={`w-0.5 flex-1 min-h-[1.5rem] ${stage.status === "completed" ? "bg-green-300" : "bg-gray-200"}`} />
                )}
              </div>
              <Link href={`/patient/${patient.id}/instructions/${stage.id}`} className="flex-1 pb-4 group">
                <div className={`rounded-xl border p-3 transition-colors hover:border-blue-200 ${
                  isCurrent ? "bg-blue-50 border-blue-200" : "bg-white border-gray-100 shadow-sm"
                }`}>
                  <div className="flex justify-between items-start">
                    <h3 className={`text-sm font-semibold group-hover:text-blue-600 transition-colors ${
                      isCurrent ? "text-blue-700" : "text-gray-900"
                    }`}>{stage.title}</h3>
                    {stage.date && <span className="text-[10px] text-gray-400 flex-shrink-0 ml-2">{formatDate(stage.date)}</span>}
                  </div>
                  <p className="text-xs text-gray-500 mt-1 line-clamp-1">{stage.instructions[0]}</p>
                </div>
              </Link>
            </div>
          );
        })}
      </div>

      {/* Connecting line between sections */}
      <div className="flex items-center gap-2 mb-4 px-1">
        <div className="flex-1 h-px bg-gray-200" />
        <span className="text-[10px] text-gray-400 font-medium">퇴원</span>
        <div className="flex-1 h-px bg-gray-200" />
      </div>

      {/* Outpatient section */}
      <div>
        <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 px-1">외래 추적</h2>
        {outpatient.map((stage, i) => {
          const isLast = i === outpatient.length - 1;
          const isCurrent = stage.status === "current";
          return (
            <div key={stage.id} className="flex" ref={isCurrent ? currentRef : undefined}>
              <div className="flex flex-col items-center mr-3">
                <Link href={`/patient/${patient.id}/instructions/${stage.id}`}>
                  {statusNode(stage.status)}
                </Link>
                {!isLast && <div className="w-0.5 flex-1 min-h-[1.5rem] bg-gray-200" />}
              </div>
              <Link href={`/patient/${patient.id}/instructions/${stage.id}`} className="flex-1 pb-4 group">
                <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-3 hover:border-blue-200 transition-colors">
                  <div className="flex justify-between items-start">
                    <h3 className="text-sm font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">{stage.title}</h3>
                    {stage.date && <span className="text-[10px] text-gray-400 flex-shrink-0 ml-2">{formatDate(stage.date)}</span>}
                  </div>
                  <p className="text-xs text-gray-500 mt-1 line-clamp-1">{stage.instructions[0]}</p>
                </div>
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
}
