"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { getSurgeryTemplate } from "@/data/surgery-templates";
import { joaItems } from "@/data/prom-instruments";
import type { PromResult } from "@/lib/types";
import { usePatientData } from "@/lib/usePatientData";

const LEGACY_STORAGE_KEY = "prom-history-v2";

function getStorageKey(patientId: string): string {
  return `prom-history-v3-${patientId}`;
}

function getHistory(patientId: string): PromResult[] {
  if (typeof window === "undefined") return [];
  try {
    const scopedRaw = localStorage.getItem(getStorageKey(patientId));
    if (scopedRaw) {
      return JSON.parse(scopedRaw);
    }

    const legacyRaw = localStorage.getItem(LEGACY_STORAGE_KEY);
    const legacyEntries: PromResult[] = legacyRaw ? JSON.parse(legacyRaw) : [];
    const filtered = legacyEntries.filter((entry) => entry.patientId === patientId);
    if (filtered.length > 0) {
      localStorage.setItem(getStorageKey(patientId), JSON.stringify(filtered));
    }
    return filtered;
  } catch {
    return [];
  }
}

export default function ProgressClient({ id }: { id: string }) {
  const { patient } = usePatientData(id);
  const template = patient ? getSurgeryTemplate(patient.surgery.type) : null;

  const [history, setHistory] = useState<PromResult[]>([]);

  useEffect(() => {
    const entries = getHistory(id).sort((a, b) => a.date.localeCompare(b.date));
    setHistory(entries);
  }, [id]);

  if (!patient) {
    return (
      <div className="animate-fade-in p-6 text-center">
        <p className="text-gray-500">환자 정보를 찾을 수 없습니다.</p>
      </div>
    );
  }

  const hasOdi = patient.promInstruments.includes("odi");
  const hasNdi = patient.promInstruments.includes("ndi");
  const hasJoa = patient.promInstruments.includes("joa");

  const vasLabel1 = template?.vasConfig.scales[0]?.label ?? "허리 통증";
  const vasLabel2 = template?.vasConfig.scales[1]?.label ?? "다리 통증/저림";

  const vasData = history.map((e) => ({
    label: e.date,
    [vasLabel1]: e.vas_back,
    [vasLabel2]: e.vas_leg,
  }));

  const odiData = history
    .filter((e) => e.odi_total_percent !== undefined)
    .map((e) => ({
      label: e.date,
      "허리 기능(%)": e.odi_total_percent as number,
    }));

  const ndiData = history
    .filter((e) => e.ndi_total_percent !== undefined)
    .map((e) => ({
      label: e.date,
      "목 기능(%)": e.ndi_total_percent as number,
    }));

  const joaData = history
    .filter((e) => e.joa_score !== undefined)
    .map((e) => ({
      label: e.date,
      "JOA 점수": e.joa_score as number,
    }));

  const eqVasData = history.map((e) => ({
    label: e.date,
    "전반 건강 점수": e.eq_vas,
  }));

  const joaMin = joaItems.reduce(
    (sum, item) => sum + Math.min(...item.options.map((option) => option.score)),
    0,
  );
  const joaMax = joaItems.reduce(
    (sum, item) => sum + Math.max(...item.options.map((option) => option.score)),
    0,
  );

  return (
    <div className="animate-fade-in space-y-4 pb-24">
      <h1 className="text-xl font-bold text-gray-900 px-1">건강 상태 변화</h1>

      <div className="bg-blue-50 border border-blue-200 rounded-xl px-3 py-2 text-[11px] text-blue-700">
        이 화면은 해당 환자의 실제 설문 기록만 표시합니다. 평균값이나 가상 예시는 포함되지 않습니다.
      </div>

      {history.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 text-center">
          <p className="text-sm text-gray-500">아직 저장된 설문 기록이 없습니다.</p>
          <Link
            href={`/patient/${id}/prom`}
            className="inline-flex mt-3 px-4 py-2 rounded-lg bg-teal-500 text-white text-sm font-semibold hover:bg-teal-600 transition-colors"
          >
            설문 작성하러 가기
          </Link>
        </div>
      ) : (
        <>
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
            <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
              통증 변화 (낮을수록 양호)
            </h2>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={vasData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="label" tick={{ fontSize: 10 }} stroke="#94a3b8" />
                <YAxis domain={[0, 10]} tick={{ fontSize: 10 }} stroke="#94a3b8" />
                <Tooltip />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Line type="monotone" dataKey={vasLabel1} stroke="#2563eb" strokeWidth={2} dot={{ r: 4 }} />
                <Line type="monotone" dataKey={vasLabel2} stroke="#f59e0b" strokeWidth={2} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {hasOdi && odiData.length > 0 && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
              <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
                허리 기능 변화 (낮을수록 양호)
              </h2>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={odiData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="label" tick={{ fontSize: 10 }} stroke="#94a3b8" />
                  <YAxis domain={[0, 100]} tick={{ fontSize: 10 }} stroke="#94a3b8" tickFormatter={(v) => `${v}%`} />
                  <Tooltip formatter={(value) => `${value}%`} />
                  <Line type="monotone" dataKey="허리 기능(%)" stroke="#10b981" strokeWidth={2} dot={{ r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}

          {hasNdi && ndiData.length > 0 && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
              <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
                목 기능 변화 (낮을수록 양호)
              </h2>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={ndiData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="label" tick={{ fontSize: 10 }} stroke="#94a3b8" />
                  <YAxis domain={[0, 100]} tick={{ fontSize: 10 }} stroke="#94a3b8" tickFormatter={(v) => `${v}%`} />
                  <Tooltip formatter={(value) => `${value}%`} />
                  <Line type="monotone" dataKey="목 기능(%)" stroke="#06b6d4" strokeWidth={2} dot={{ r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}

          {hasJoa && joaData.length > 0 && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
              <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
                JOA 신경 기능 점수 변화 (범위 {joaMin}~{joaMax}, 높을수록 양호)
              </h2>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={joaData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="label" tick={{ fontSize: 10 }} stroke="#94a3b8" />
                  <YAxis domain={[joaMin, joaMax]} tick={{ fontSize: 10 }} stroke="#94a3b8" />
                  <Tooltip />
                  <Line type="monotone" dataKey="JOA 점수" stroke="#8b5cf6" strokeWidth={2} dot={{ r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
            <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
              전반 건강 점수 변화 (높을수록 양호, 만점 100)
            </h2>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={eqVasData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="label" tick={{ fontSize: 10 }} stroke="#94a3b8" />
                <YAxis domain={[0, 100]} tick={{ fontSize: 10 }} stroke="#94a3b8" />
                <Tooltip />
                <Line type="monotone" dataKey="전반 건강 점수" stroke="#ef4444" strokeWidth={2} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 overflow-x-auto">
            <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
              추이 비교표
            </h2>
            <table className="w-full text-sm">
              <thead>
                <tr className="text-gray-400 text-[10px] border-b border-gray-100">
                  <th className="text-left py-2 pr-2">시점</th>
                  <th className="text-center py-2 px-1">{vasLabel1.replace(" 통증", "").replace("/저림", "")}</th>
                  <th className="text-center py-2 px-1">{vasLabel2.replace(" 통증", "").replace("/저림", "")}</th>
                  {hasOdi && <th className="text-center py-2 px-1">허리 기능</th>}
                  {hasNdi && <th className="text-center py-2 px-1">목 기능</th>}
                  {hasJoa && <th className="text-center py-2 px-1">JOA</th>}
                  <th className="text-center py-2 pl-1">전반 건강</th>
                </tr>
              </thead>
              <tbody>
                {history.map((e, i) => (
                  <tr key={`${e.date}-${i}`} className="border-b border-gray-50">
                    <td className="py-2 pr-2 text-xs text-gray-600 font-medium">{e.date}</td>
                    <td className="py-2 px-1 text-center text-xs">{e.vas_back}</td>
                    <td className="py-2 px-1 text-center text-xs">{e.vas_leg}</td>
                    {hasOdi && <td className="py-2 px-1 text-center text-xs">{e.odi_total_percent !== undefined ? `${e.odi_total_percent}%` : "-"}</td>}
                    {hasNdi && <td className="py-2 px-1 text-center text-xs">{e.ndi_total_percent !== undefined ? `${e.ndi_total_percent}%` : "-"}</td>}
                    {hasJoa && <td className="py-2 px-1 text-center text-xs">{e.joa_score ?? "-"}</td>}
                    <td className="py-2 pl-1 text-center text-xs">{e.eq_vas}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}
