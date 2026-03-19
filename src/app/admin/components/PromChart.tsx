"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import type { PatientDetail, Timepoint } from "@/lib/types/admin";

const TIMEPOINTS: Timepoint[] = ["pre", "1mo", "3mo", "6mo", "1y"];
const TP_LABELS: Record<Timepoint, string> = {
  pre: "수술 전",
  "1mo": "1개월",
  "3mo": "3개월",
  "6mo": "6개월",
  "1y": "1년",
};

const GRID_COLOR = "#27272a";
const AXIS_STYLE = { fill: "#71717a", fontSize: 11 };
const TOOLTIP_STYLE = {
  backgroundColor: "#18181b",
  border: "1px solid #3f3f46",
  borderRadius: 8,
  color: "#e4e4e7",
  fontSize: 12,
};

interface ChartConfig {
  title: string;
  dataKeys: { key: string; label: string; color: string }[];
  domain: [number, number];
  getValue: (
    tp: Timepoint,
    detail: PatientDetail
  ) => Record<string, number | null>;
  hasData: (detail: PatientDetail) => boolean;
}

const charts: ChartConfig[] = [
  {
    title: "VAS 통증",
    dataKeys: [
      { key: "prox", label: "근위부", color: "#f97316" },
      { key: "dist", label: "원위부", color: "#f59e0b" },
    ],
    domain: [0, 10],
    getValue: (tp, d) => ({
      prox: d.prom[tp]?.vasProx ?? null,
      dist: d.prom[tp]?.vasDist ?? null,
    }),
    hasData: (d) => TIMEPOINTS.some((tp) => d.prom[tp]?.vasProx !== null),
  },
  {
    title: "ODI / NDI (%)",
    dataKeys: [{ key: "score", label: "점수", color: "#3b82f6" }],
    domain: [0, 100],
    getValue: (tp, d) => ({
      score:
        d.region === "cervical"
          ? (d.prom[tp]?.ndiPercent ?? null)
          : (d.prom[tp]?.odiPercent ?? null),
    }),
    hasData: (d) =>
      TIMEPOINTS.some(
        (tp) =>
          d.prom[tp]?.odiPercent !== null || d.prom[tp]?.ndiPercent !== null
      ),
  },
  {
    title: "JOA 점수",
    dataKeys: [{ key: "score", label: "JOA", color: "#8b5cf6" }],
    domain: [0, 17],
    getValue: (tp, d) => ({ score: d.prom[tp]?.joaScore ?? null }),
    hasData: (d) => TIMEPOINTS.some((tp) => d.prom[tp]?.joaScore !== null),
  },
  {
    title: "EQ-VAS",
    dataKeys: [{ key: "score", label: "EQ-VAS", color: "#10b981" }],
    domain: [0, 100],
    getValue: (tp, d) => ({ score: d.prom[tp]?.eqVas ?? null }),
    hasData: (d) => TIMEPOINTS.some((tp) => d.prom[tp]?.eqVas !== null),
  },
];

export default function PromChart({ patient }: { patient: PatientDetail }) {
  const activeCharts = charts.filter((c) => c.hasData(patient));

  if (activeCharts.length === 0) {
    return (
      <p className="py-8 text-center text-sm text-zinc-500">
        PROM 데이터가 없습니다
      </p>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {activeCharts.map((chart) => {
        const data = TIMEPOINTS.map((tp) => ({
          name: TP_LABELS[tp],
          ...chart.getValue(tp, patient),
        }));

        return (
          <div
            key={chart.title}
            className="rounded-xl border border-zinc-800 bg-zinc-900 p-4"
          >
            <h4 className="mb-3 text-sm font-medium text-zinc-300">
              {chart.title}
              {chart.title.includes("ODI") && (
                <span className="ml-2 text-xs text-zinc-500">
                  ({patient.region === "cervical" ? "NDI" : "ODI"})
                </span>
              )}
            </h4>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={data}>
                <CartesianGrid stroke={GRID_COLOR} strokeDasharray="3 3" />
                <XAxis
                  dataKey="name"
                  tick={AXIS_STYLE}
                  axisLine={{ stroke: GRID_COLOR }}
                />
                <YAxis
                  domain={chart.domain}
                  tick={AXIS_STYLE}
                  axisLine={{ stroke: GRID_COLOR }}
                  width={30}
                />
                <Tooltip contentStyle={TOOLTIP_STYLE} />
                {chart.dataKeys.map((dk) => (
                  <Line
                    key={dk.key}
                    type="monotone"
                    dataKey={dk.key}
                    name={dk.label}
                    stroke={dk.color}
                    strokeWidth={2}
                    dot={{ fill: dk.color, r: 3 }}
                    connectNulls
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </div>
        );
      })}
    </div>
  );
}
