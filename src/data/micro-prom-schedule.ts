import type { MicroPromCheckpoint } from "@/lib/types";

export const MICRO_PROM_SCHEDULE: MicroPromCheckpoint[] = [
  { day: 1, label: "D+1", recommendedInstruments: ["vas", "eqvas"] },
  { day: 3, label: "D+3", recommendedInstruments: ["vas", "eqvas"] },
  { day: 5, label: "D+5", recommendedInstruments: ["vas", "eqvas"] },
  { day: 7, label: "D+7", recommendedInstruments: ["vas", "eqvas"] },
  { day: 14, label: "D+14", recommendedInstruments: ["vas", "odi", "ndi", "eq5d", "eqvas"] },
  { day: 30, label: "D+30", recommendedInstruments: ["vas", "odi", "ndi", "joa", "eq5d", "eqvas"] },
  { day: 90, label: "D+90", recommendedInstruments: ["vas", "odi", "ndi", "joa", "eq5d", "eqvas"] },
  { day: 180, label: "D+180", recommendedInstruments: ["vas", "odi", "ndi", "joa", "eq5d", "eqvas"] },
  { day: 365, label: "D+365", recommendedInstruments: ["vas", "odi", "ndi", "joa", "eq5d", "eqvas"] },
];

function toDayNumber(baseDate: string): number {
  const surgery = new Date(baseDate);
  surgery.setHours(0, 0, 0, 0);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return Math.floor((today.getTime() - surgery.getTime()) / (1000 * 60 * 60 * 24));
}

export function getNextMicroPromCheckpoint(surgeryDate: string): MicroPromCheckpoint | null {
  const daySinceSurgery = toDayNumber(surgeryDate);
  return MICRO_PROM_SCHEDULE.find((cp) => cp.day >= daySinceSurgery) ?? null;
}
