import type { SurgeryType, PromInstrumentId } from "@/data/surgery-templates/types";

// Re-export for convenience
export type { SurgeryType, PromInstrumentId };

// ── Stage & Status ──────────────────────────────────────────────

export type StageStatus = "completed" | "current" | "upcoming";

export type StagePhase = "inpatient" | "outpatient";

export interface FaqItem {
  question: string;
  answer: string;
}

export interface ClinicalStage {
  id: string;
  title: string;
  date: string | null;
  status: StageStatus;
  phase: StagePhase;
  instructions: string[];
  warnings: string[];
  dos: string[];
  donts: string[];
  faq?: FaqItem[];
}

// ── Patient ─────────────────────────────────────────────────────

export interface Patient {
  id: string;
  subdomain: string;
  name: string;
  age: number;
  sex: "M" | "F";
  diagnosis: {
    code: string;
    name: string;
    nameKo: string;
  };
  surgery: {
    type: SurgeryType;
    name: string;
    nameKo: string;
    abbreviation: string;
    date: string;
    categories: string[];
  };
  admission: {
    date: string;
    expectedDischarge: string;
  };
  hospital: string;
  surgeon: string;
  promInstruments: PromInstrumentId[];
  followUps: FollowUp[];
  stages: ClinicalStage[];
}

export interface PromTrendPoint {
  label: string;
  date: string;
  vas_back: number | null;
  vas_leg: number | null;
  odi_percent: number | null;
  ndi_percent: number | null;
  joa_score: number | null;
  eq_vas: number | null;
}

export interface PatientApiResponse {
  patient: Patient;
  promTrend: PromTrendPoint[];
}

export interface FollowUp {
  label: string;
  date: string;
}

// ── PROM Result ─────────────────────────────────────────────────

export interface PromResult {
  patientId: string;
  date: string;
  vas_back: number; // 0–10
  vas_leg: number; // 0–10
  odi_scores?: number[]; // 10 items, each 0–5 (lumbar)
  odi_total_percent?: number; // 0–100
  ndi_scores?: number[]; // 10 items, each 0–5 (cervical)
  ndi_total_percent?: number; // 0–100
  joa_score?: number; // 0–29
  joa_recovery_rate?: number | null; // % or null if no preop
  eq5d_dimensions: number[]; // 5 items, each 1–5
  eq5d_code: string; // e.g. "11111"
  eq_vas: number; // 0–100
  timestamp: string;
}

// ── PROM Instrument Definitions ─────────────────────────────────

export interface OdiSection {
  id: string;
  title: string;
  options: string[]; // 6 options (0–5)
}

export interface NdiSection {
  id: string;
  title: string;
  options: string[]; // 6 options (0–5)
}

export interface Eq5dDimension {
  id: string;
  title: string;
  levels: string[]; // 5 levels (1–5)
}

export interface JoaItem {
  id: string;
  title: string;
  options: { label: string; score: number }[];
}

// ── Inpatient Schedule ──────────────────────────────────────────

export interface ScheduleRow {
  time: string;
  activity: string;
  icon?: string;
}

export interface DaySchedule {
  day: string;
  label: string;
  rows: ScheduleRow[];
}
