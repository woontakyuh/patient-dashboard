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
  name: string;
  age: number;
  diagnosis: {
    code: string;
    name: string;
    nameKo: string;
  };
  surgery: {
    name: string;
    nameKo: string;
    abbreviation: string;
    date: string;
  };
  admission: {
    date: string;
    expectedDischarge: string;
  };
  followUps: FollowUp[];
  stages: ClinicalStage[];
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
  odi_scores: number[]; // 10 items, each 0–5
  odi_total_percent: number; // 0–100
  joa_score: number; // 0–29 (lumbar)
  joa_recovery_rate: number | null; // % or null if no preop
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
