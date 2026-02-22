import type { Patient, ClinicalStage, FollowUp, StageStatus } from "@/lib/types";
import type { SurgeryType } from "@/data/surgery-templates/types";
import { getSurgeryTemplate } from "@/data/surgery-templates";

// ── Helpers ──────────────────────────────────────────────────────

function addDays(dateStr: string, days: number): string {
  const d = new Date(dateStr);
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

function computeStatus(dateStr: string): StageStatus {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const d = new Date(dateStr);
  d.setHours(0, 0, 0, 0);
  const diff = (d.getTime() - today.getTime()) / (1000 * 60 * 60 * 24);
  if (diff < -1) return "completed";
  if (diff <= 1) return "current";
  return "upcoming";
}

export function buildStagesFromTemplate(
  surgeryDate: string,
  surgeryType: SurgeryType,
): ClinicalStage[] {
  const template = getSurgeryTemplate(surgeryType);
  return template.stages.map((s) => {
    const date = s.dateOffset !== null ? addDays(surgeryDate, s.dateOffset) : "";
    return {
      id: s.id,
      title: s.title,
      date,
      status: computeStatus(date),
      phase: s.phase,
      instructions: s.instructions,
      warnings: s.warnings,
      dos: s.dos,
      donts: s.donts,
      faq: s.faq,
    };
  });
}

export function buildFollowUpsFromTemplate(
  surgeryDate: string,
  surgeryType: SurgeryType,
): FollowUp[] {
  const template = getSurgeryTemplate(surgeryType);
  return template.followUpOffsets.map((f) => ({
    label: f.label,
    date: addDays(surgeryDate, f.daysAfterSurgery),
  }));
}

// ── Mock Patients ────────────────────────────────────────────────

const ubeTemplate = getSurgeryTemplate("ube");
const vpTemplate = getSurgeryTemplate("vp");
const acdfTemplate = getSurgeryTemplate("acdf");
const lpTemplate = getSurgeryTemplate("lp");
const fusionTemplate = getSurgeryTemplate("fusion");

const mockPatientsData: Patient[] = [
  // P001 — UBE (기존 김태수)
  {
    id: "P001",
    subdomain: "09782901",
    name: "김태수",
    age: 29,
    sex: "M",
    diagnosis: {
      code: "L4-5",
      name: "HIVD (Lumbar disc herniation)",
      nameKo: "요추 4-5번 추간판 탈출증",
    },
    surgery: {
      type: "ube",
      name: ubeTemplate.name,
      nameKo: ubeTemplate.nameKo,
      abbreviation: ubeTemplate.abbreviation,
      date: "2026-02-10",
      categories: ["UBE"],
    },
    admission: {
      date: "2026-02-09",
      expectedDischarge: "2026-02-11",
    },
    hospital: "다보스 병원",
    surgeon: "유원탁",
    promInstruments: ubeTemplate.promInstruments,
    followUps: buildFollowUpsFromTemplate("2026-02-10", "ube"),
    stages: buildStagesFromTemplate("2026-02-10", "ube"),
  },

  // P002 — VP (골다공증 압박골절)
  {
    id: "P002",
    subdomain: "10234501",
    name: "박순자",
    age: 74,
    sex: "F",
    diagnosis: {
      code: "T12",
      name: "Osteoporotic compression fracture",
      nameKo: "흉추 12번 골다공증성 압박골절",
    },
    surgery: {
      type: "vp",
      name: vpTemplate.name,
      nameKo: vpTemplate.nameKo,
      abbreviation: vpTemplate.abbreviation,
      date: "2026-02-15",
      categories: ["VP"],
    },
    admission: {
      date: "2026-02-14",
      expectedDischarge: "2026-02-16",
    },
    hospital: "다보스 병원",
    surgeon: "유원탁",
    promInstruments: vpTemplate.promInstruments,
    followUps: buildFollowUpsFromTemplate("2026-02-15", "vp"),
    stages: buildStagesFromTemplate("2026-02-15", "vp"),
  },

  // P003 — ACDF (경추 디스크)
  {
    id: "P003",
    subdomain: "10345602",
    name: "이정훈",
    age: 52,
    sex: "M",
    diagnosis: {
      code: "C5-6",
      name: "Cervical disc herniation with radiculopathy",
      nameKo: "경추 5-6번 추간판 탈출증",
    },
    surgery: {
      type: "acdf",
      name: acdfTemplate.name,
      nameKo: acdfTemplate.nameKo,
      abbreviation: acdfTemplate.abbreviation,
      date: "2026-02-20",
      categories: ["ACDF"],
    },
    admission: {
      date: "2026-02-19",
      expectedDischarge: "2026-02-22",
    },
    hospital: "다보스 병원",
    surgeon: "유원탁",
    promInstruments: acdfTemplate.promInstruments,
    followUps: buildFollowUpsFromTemplate("2026-02-20", "acdf"),
    stages: buildStagesFromTemplate("2026-02-20", "acdf"),
  },

  // P004 — LP (경추 추궁판 성형술)
  {
    id: "P004",
    subdomain: "10456703",
    name: "최영희",
    age: 65,
    sex: "F",
    diagnosis: {
      code: "C3-6",
      name: "Cervical spinal stenosis with myelopathy",
      nameKo: "경추 3-6번 척추관 협착증 (척수병증)",
    },
    surgery: {
      type: "lp",
      name: lpTemplate.name,
      nameKo: lpTemplate.nameKo,
      abbreviation: lpTemplate.abbreviation,
      date: "2026-03-05",
      categories: ["LP"],
    },
    admission: {
      date: "2026-03-04",
      expectedDischarge: "2026-03-08",
    },
    hospital: "다보스 병원",
    surgeon: "유원탁",
    promInstruments: lpTemplate.promInstruments,
    followUps: buildFollowUpsFromTemplate("2026-03-05", "lp"),
    stages: buildStagesFromTemplate("2026-03-05", "lp"),
  },

  // P005 — Fusion (요추 유합술)
  {
    id: "P005",
    subdomain: "10567804",
    name: "정민수",
    age: 58,
    sex: "M",
    diagnosis: {
      code: "L4-5",
      name: "Spondylolisthesis with spinal stenosis",
      nameKo: "요추 4-5번 전방전위증 동반 척추관 협착증",
    },
    surgery: {
      type: "fusion",
      name: fusionTemplate.name,
      nameKo: fusionTemplate.nameKo,
      abbreviation: fusionTemplate.abbreviation,
      date: "2026-03-10",
      categories: ["Fusion"],
    },
    admission: {
      date: "2026-03-09",
      expectedDischarge: "2026-03-15",
    },
    hospital: "다보스 병원",
    surgeon: "유원탁",
    promInstruments: fusionTemplate.promInstruments,
    followUps: buildFollowUpsFromTemplate("2026-03-10", "fusion"),
    stages: buildStagesFromTemplate("2026-03-10", "fusion"),
  },
];

// ── Lookup ───────────────────────────────────────────────────────

const patientsById = new Map(mockPatientsData.map((p) => [p.id, p]));

export function getPatientById(id: string): Patient | undefined {
  return patientsById.get(id);
}

export function getAllPatientIds(): string[] {
  return mockPatientsData.map((p) => p.id);
}

// Backward compatibility
export const mockPatient: Patient = mockPatientsData[0];
