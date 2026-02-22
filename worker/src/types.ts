export interface Env {
  NOTION_API_KEY: string;
  NOTION_DATABASE_ID: string;
  PAGES_DOMAIN: string;
  PATIENT_CACHE: KVNamespace;
}

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
  promInstruments: string[];
  followUps: FollowUp[];
  stages: ClinicalStage[];
}

export interface FollowUp {
  label: string;
  date: string;
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface ClinicalStage {
  id: string;
  title: string;
  date: string;
  status: "completed" | "current" | "upcoming";
  phase: "inpatient" | "outpatient";
  instructions: string[];
  warnings: string[];
  dos: string[];
  donts: string[];
  faq?: FaqItem[];
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

export interface PromSubmission {
  vas_back: number;
  vas_leg: number;
  odi_scores?: number[];
  odi_total_percent: number;
  ndi_scores?: number[];
  ndi_total_percent?: number;
  joa_score: number;
  eq5d_dimensions: number[];
  eq5d_code: string;
  eq_vas: number;
}
