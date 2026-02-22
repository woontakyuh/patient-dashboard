"use client";

import { useEffect, useState } from "react";
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
import { mockPromTrend } from "@/data/prom-instruments";
import { getPatientById } from "@/data/mock-patient";
import { getSurgeryTemplate } from "@/data/surgery-templates";
import type { PromResult } from "@/lib/types";

const STORAGE_KEY = "prom-history-v2";

function getHistory(): PromResult[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export default function ProgressClient({ id }: { id: string }) {
  const patient = getPatientById(id);
  const template = patient ? getSurgeryTemplate(patient.surgery.type) : null;

  const [history, setHistory] = useState<PromResult[]>([]);

  useEffect(() => {
    setHistory(getHistory());
  }, []);

  const hasOdi = patient?.promInstruments.includes("odi") ?? false;
  const hasNdi = patient?.promInstruments.includes("ndi") ?? false;
  const hasJoa = patient?.promInstruments.includes("joa") ?? false;

  const vasLabel1 = template?.vasConfig.scales[0]?.label ?? "허리 VAS";
  const vasLabel2 = template?.vasConfig.scales[1]?.label ?? "다리 VAS";

  // Combine mock trend with actual history for display
  const vasData = mockPromTrend.map((m) => ({
    label: m.label,
    [vasLabel1]: m.vas_back,
    [vasLabel2]: m.vas_leg,
  }));
  history.forEach((e) => {
    vasData.push({
      label: e.date,
      [vasLabel1]: e.vas_back,
      [vasLabel2]: e.vas_leg,
    });
  });

  const odiData = mockPromTrend.map((m) => ({
    label: m.label,
    "ODI (%)": m.odi_percent,
  }));
  history.forEach((e) => {
    if (e.odi_total_percent !== undefined) {
      odiData.push({ label: e.date, "ODI (%)": e.odi_total_percent });
    }
  });

  const ndiData: { label: string; "NDI (%)": number }[] = [];
  history.forEach((e) => {
    if (e.ndi_total_percent !== undefined) {
      ndiData.push({ label: e.date, "NDI (%)": e.ndi_total_percent });
    }
  });

  const joaData = mockPromTrend.map((m) => ({
    label: m.label,
    "JOA 점수": m.joa_score,
  }));
  history.forEach((e) => {
    if (e.joa_score !== undefined) {
      joaData.push({ label: e.date, "JOA 점수": e.joa_score });
    }
  });

  const eqVasData = mockPromTrend.map((m) => ({
    label: m.label,
    "EQ-VAS": m.eq_vas,
  }));
  history.forEach((e) => {
    eqVasData.push({ label: e.date, "EQ-VAS": e.eq_vas });
  });

  if (!patient) {
    return (
      <div className="animate-fade-in p-6 text-center">
        <p className="text-gray-500">환자 정보를 찾을 수 없습니다.</p>
      </div>
    );
  }

  return (
    <div className="animate-fade-in space-y-4 pb-24">
      <h1 className="text-xl font-bold text-gray-900 px-1">PROM 추이</h1>

      {/* VAS Chart */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
        <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
          VAS 통증 점수 (낮을수록 양호)
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

      {/* ODI Chart */}
      {hasOdi && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
          <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
            ODI 장애 지수 (낮을수록 양호)
          </h2>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={odiData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="label" tick={{ fontSize: 10 }} stroke="#94a3b8" />
              <YAxis domain={[0, 100]} tick={{ fontSize: 10 }} stroke="#94a3b8" tickFormatter={(v) => `${v}%`} />
              <Tooltip formatter={(value) => `${value}%`} />
              <Line type="monotone" dataKey="ODI (%)" stroke="#10b981" strokeWidth={2} dot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* NDI Chart */}
      {hasNdi && ndiData.length > 0 && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
          <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
            NDI 목 장애 지수 (낮을수록 양호)
          </h2>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={ndiData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="label" tick={{ fontSize: 10 }} stroke="#94a3b8" />
              <YAxis domain={[0, 100]} tick={{ fontSize: 10 }} stroke="#94a3b8" tickFormatter={(v) => `${v}%`} />
              <Tooltip formatter={(value) => `${value}%`} />
              <Line type="monotone" dataKey="NDI (%)" stroke="#06b6d4" strokeWidth={2} dot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* JOA Chart */}
      {hasJoa && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
          <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
            JOA 점수 (높을수록 양호, 만점 29)
          </h2>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={joaData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="label" tick={{ fontSize: 10 }} stroke="#94a3b8" />
              <YAxis domain={[0, 29]} tick={{ fontSize: 10 }} stroke="#94a3b8" />
              <Tooltip />
              <Line type="monotone" dataKey="JOA 점수" stroke="#8b5cf6" strokeWidth={2} dot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* EQ-VAS Chart */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
        <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
          EQ-VAS 건강 상태 (높을수록 양호, 만점 100)
        </h2>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={eqVasData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis dataKey="label" tick={{ fontSize: 10 }} stroke="#94a3b8" />
            <YAxis domain={[0, 100]} tick={{ fontSize: 10 }} stroke="#94a3b8" />
            <Tooltip />
            <Line type="monotone" dataKey="EQ-VAS" stroke="#ef4444" strokeWidth={2} dot={{ r: 4 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Comparison Table */}
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
              {hasOdi && <th className="text-center py-2 px-1">ODI</th>}
              {hasNdi && <th className="text-center py-2 px-1">NDI</th>}
              {hasJoa && <th className="text-center py-2 px-1">JOA</th>}
              <th className="text-center py-2 pl-1">EQ-VAS</th>
            </tr>
          </thead>
          <tbody>
            {mockPromTrend.map((m) => (
              <tr key={m.label} className="border-b border-gray-50">
                <td className="py-2 pr-2 text-xs text-gray-600 font-medium">{m.label}</td>
                <td className="py-2 px-1 text-center text-xs">{m.vas_back}</td>
                <td className="py-2 px-1 text-center text-xs">{m.vas_leg}</td>
                {hasOdi && <td className="py-2 px-1 text-center text-xs">{m.odi_percent}%</td>}
                {hasNdi && <td className="py-2 px-1 text-center text-xs">-</td>}
                {hasJoa && <td className="py-2 px-1 text-center text-xs">{m.joa_score}</td>}
                <td className="py-2 pl-1 text-center text-xs">{m.eq_vas}</td>
              </tr>
            ))}
            {history.map((e, i) => (
              <tr key={i} className="border-b border-gray-50 bg-blue-50/30">
                <td className="py-2 pr-2 text-xs text-blue-600 font-medium">{e.date}</td>
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
    </div>
  );
}
