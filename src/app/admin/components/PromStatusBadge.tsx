import type { PromStatus, Timepoint } from "@/lib/types/admin";

const TIMEPOINTS: { key: Timepoint; label: string }[] = [
  { key: "pre", label: "Pre" },
  { key: "1mo", label: "1M" },
  { key: "3mo", label: "3M" },
  { key: "6mo", label: "6M" },
  { key: "1y", label: "1Y" },
];

export default function PromStatusBadge({ status }: { status: PromStatus }) {
  const completed = Object.values(status).filter(Boolean).length;
  const total = TIMEPOINTS.length;

  return (
    <div className="flex items-center gap-1.5">
      {TIMEPOINTS.map((tp) => (
        <div
          key={tp.key}
          className={`flex h-6 w-8 items-center justify-center rounded text-[10px] font-medium ${
            status[tp.key]
              ? "bg-emerald-500/15 text-emerald-400"
              : "bg-zinc-800 text-zinc-600"
          }`}
          title={`${tp.label}: ${status[tp.key] ? "완료" : "미완료"}`}
        >
          {tp.label}
        </div>
      ))}
      <span className="ml-1 text-xs text-zinc-500">
        {completed}/{total}
      </span>
    </div>
  );
}
