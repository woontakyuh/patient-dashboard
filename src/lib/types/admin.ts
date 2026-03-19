export interface PatientRow {
  pageId: string;
  name: string;
  ptNo: string;
  age: number;
  sex: "M" | "F";
  hospital: string;
  surgeon: string;
  opDate: string;
  opName: string;
  opCategory: string[];
  classA: string[];
  classB: string[];
  promStatus: PromStatus;
}

export interface PromStatus {
  pre: boolean;
  "1mo": boolean;
  "3mo": boolean;
  "6mo": boolean;
  "1y": boolean;
}

export type Timepoint = "pre" | "1mo" | "3mo" | "6mo" | "1y";

export interface ParsedProm {
  vasProx: number | null;
  vasDist: number | null;
  odiPercent: number | null;
  ndiPercent: number | null;
  joaScore: number | null;
  eq5dUtility: number | null;
  eqVas: number | null;
}

export type PromRecord = Partial<Record<Timepoint, ParsedProm>>;

export interface PatientDetail {
  pageId: string;
  name: string;
  ptNo: string;
  age: number;
  sex: "M" | "F";
  opDate: string;
  opName: string;
  hospital: string;
  surgeon: string;
  region: "cervical" | "lumbar" | "unknown";
  prom: PromRecord;
}
