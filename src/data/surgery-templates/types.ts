import type { FaqItem, ScheduleRow } from "@/lib/types";

export type SurgeryType = "ube" | "vp" | "acdf" | "lp" | "fusion";

export type SpineRegion = "lumbar" | "cervical" | "thoracolumbar";

export type PromInstrumentId = "vas" | "odi" | "ndi" | "joa" | "eq5d" | "eqvas";

export interface VasConfig {
  scales: { id: string; label: string }[];
}

export interface TemplateStage {
  id: string;
  title: string;
  dateOffset: number | null;
  phase: "inpatient" | "outpatient";
  instructions: string[];
  warnings: string[];
  dos: string[];
  donts: string[];
  faq?: FaqItem[];
}

export interface TemplateDaySchedule {
  day: string;
  dateOffset: number;
  rows: ScheduleRow[];
}

export interface SurgeryTemplate {
  type: SurgeryType;
  name: string;
  nameKo: string;
  abbreviation: string;
  region: SpineRegion;
  durationMinutes: number;
  stayNights: number;
  promInstruments: PromInstrumentId[];
  vasConfig: VasConfig;
  stages: TemplateStage[];
  inpatientSchedule: TemplateDaySchedule[];
  followUpOffsets: { label: string; daysAfterSurgery: number }[];
}
