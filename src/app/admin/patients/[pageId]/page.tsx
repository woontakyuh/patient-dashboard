"use client";

import { useQuery } from "@tanstack/react-query";
import { ArrowLeft } from "lucide-react";
import PromChart from "../../components/PromChart";
import type { PatientDetail, Timepoint } from "@/lib/types/admin";

const TIMEPOINTS: Timepoint[] = ["pre", "1mo", "3mo", "6mo", "1y"];
const TP_LABELS: Record<Timepoint, string> = {
  pre: "Pre",
  "1mo": "1M",
  "3mo": "3M",
  "6mo": "6M",
  "1y": "1Y",
};

export default function PatientDetailPage({
  params,
}: {
  params: { pageId: string };
}) {
  const { data: patient, isLoading } = useQuery({
    queryKey: ["patient", params.pageId],
    queryFn: async () => {
      const res = await fetch(`/api/admin/patients/${params.pageId}`);
      if (!res.ok) throw new Error("Failed to fetch");
      return res.json() as Promise<PatientDetail>;
    },
  });

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center text-zinc-500">
        불러오는 중...
      </div>
    );
  }

  if (!patient) {
    return (
      <div className="flex h-64 items-center justify-center text-zinc-500">
        환자를 찾을 수 없습니다
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl">
      {/* Back */}
      <a
        href="/admin"
        className="inline-flex items-center gap-1.5 text-sm text-zinc-400 transition-colors hover:text-white"
      >
        <ArrowLeft className="h-4 w-4" />
        환자 목록
      </a>

      {/* Patient info */}
      <div className="mt-4 rounded-xl border border-zinc-800 bg-zinc-900 p-6">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-xl font-bold text-white">{patient.name}</h1>
            <p className="mt-1 text-sm text-zinc-400">
              {patient.ptNo} · {patient.sex}/{patient.age} · {patient.hospital}
            </p>
          </div>
          <div className="text-right">
            <div className="text-sm text-zinc-300">{patient.opName}</div>
            <div className="text-xs text-zinc-500">{patient.opDate}</div>
          </div>
        </div>

        {/* PROM status overview */}
        <div className="mt-4 border-t border-zinc-800 pt-4">
          <span className="text-xs font-medium text-zinc-500">
            PROM 응답 현황
          </span>
          <div className="mt-2 flex items-center gap-1.5">
            {TIMEPOINTS.map((tp) => {
              const hasData = patient.prom[tp]
                ? Object.values(patient.prom[tp]!).some((v) => v !== null)
                : false;
              return (
                <div
                  key={tp}
                  className={`flex h-6 w-8 items-center justify-center rounded text-[10px] font-medium ${
                    hasData
                      ? "bg-emerald-500/15 text-emerald-400"
                      : "bg-zinc-800 text-zinc-600"
                  }`}
                >
                  {TP_LABELS[tp]}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* PROM Charts */}
      <div className="mt-6">
        <h2 className="text-lg font-semibold text-white">PROM 추이</h2>
        <div className="mt-4">
          <PromChart patient={patient} />
        </div>
      </div>
    </div>
  );
}
