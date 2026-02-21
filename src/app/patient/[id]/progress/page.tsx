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

export default function ProgressPage({
  params: _params,
}: {
  params: { id: string };
}) {
  const [history, setHistory] = useState<PromResult[]>([]);

  useEffect(() => {
    setHistory(getHistory());
  }, []);

  // Combine mock trend with actual history for display
  const vasData = mockPromTrend.map((m) => ({
    label: m.label,
    "허리 VAS": m.vas_back,
    "다리 VAS": m.vas_leg,
  }));
  // Append user-submitted data
  history.forEach((e) => {
    vasData.push({
      label: e.date,
      "허리 VAS": e.vas_back,
      "다리 VAS": e.vas_leg,
    });
  });

  const odiData = mockPromTrend.map((m) => ({
    label: m.label,
    "ODI (%)": m.odi_percent,
  }));
  history.forEach((e) => {
    odiData.push({ label: e.date, "ODI (%)": e.odi_total_percent });
  });

  const joaData = mockPromTrend.map((m) => ({
    label: m.label,
    "JOA 점수": m.joa_score,
  }));
  history.forEach((e) => {
    joaData.push({ label: e.date, "JOA 점수": e.joa_score });
  });

  const eqVasData = mockPromTrend.map((m) => ({
    label: m.label,
    "EQ-VAS": m.eq_vas,
  }));
  history.forEach((e) => {
    eqVasData.push({ label: e.date, "EQ-VAS": e.eq_vas });
  });

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
            <Line type="monotone" dataKey="허리 VAS" stroke="#2563eb" strokeWidth={2} dot={{ r: 4 }} />
            <Line type="monotone" dataKey="다리 VAS" stroke="#f59e0b" strokeWidth={2} dot={{ r: 4 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* ODI Chart */}
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

      {/* JOA Chart */}
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
              <th className="text-center py-2 px-1">허리</th>
              <th className="text-center py-2 px-1">다리</th>
              <th className="text-center py-2 px-1">ODI</th>
              <th className="text-center py-2 px-1">JOA</th>
              <th className="text-center py-2 pl-1">EQ-VAS</th>
            </tr>
          </thead>
          <tbody>
            {mockPromTrend.map((m) => (
              <tr key={m.label} className="border-b border-gray-50">
                <td className="py-2 pr-2 text-xs text-gray-600 font-medium">{m.label}</td>
                <td className="py-2 px-1 text-center text-xs">{m.vas_back}</td>
                <td className="py-2 px-1 text-center text-xs">{m.vas_leg}</td>
                <td className="py-2 px-1 text-center text-xs">{m.odi_percent}%</td>
                <td className="py-2 px-1 text-center text-xs">{m.joa_score}</td>
                <td className="py-2 pl-1 text-center text-xs">{m.eq_vas}</td>
              </tr>
            ))}
            {history.map((e, i) => (
              <tr key={i} className="border-b border-gray-50 bg-blue-50/30">
                <td className="py-2 pr-2 text-xs text-blue-600 font-medium">{e.date}</td>
                <td className="py-2 px-1 text-center text-xs">{e.vas_back}</td>
                <td className="py-2 px-1 text-center text-xs">{e.vas_leg}</td>
                <td className="py-2 px-1 text-center text-xs">{e.odi_total_percent}%</td>
                <td className="py-2 px-1 text-center text-xs">{e.joa_score}</td>
                <td className="py-2 pl-1 text-center text-xs">{e.eq_vas}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
