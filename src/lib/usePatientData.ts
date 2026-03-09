"use client";

import { useEffect, useState } from "react";
import {
  buildFollowUpsFromTemplate,
  buildStagesFromTemplate,
  getPatientById,
} from "@/data/mock-patient";
import { detectSurgeryType } from "@/lib/surgery-classifier";
import type { Patient, PromInstrumentId } from "@/lib/types";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "";

const PROM_MAP: Record<string, PromInstrumentId> = {
  vas: "vas",
  odi: "odi",
  ndi: "ndi",
  joa: "joa",
  eq5d: "eq5d",
  eqvas: "eqvas",
};

interface WorkerPatientResponse {
  patient?: {
    id: string;
    subdomain: string;
    name: string;
    birthDate?: string;
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
      schedule?: string;
    };
    admission: {
      date: string;
      expectedDischarge: string;
    };
    hospital: string;
    surgeon: string;
    promInstruments?: string[];
  };
}

function normalizePromInstruments(input: string[] | undefined): PromInstrumentId[] {
  if (!input || input.length === 0) return [];
  return input
    .map((item) => item.toLowerCase().replace(/[^a-z0-9]/g, ""))
    .map((key) => PROM_MAP[key])
    .filter((v): v is PromInstrumentId => Boolean(v));
}

function buildPatientFromWorker(raw: NonNullable<WorkerPatientResponse["patient"]>, fallback: Patient | null): Patient {
  const surgeryType = detectSurgeryType(raw.surgery.categories ?? [], raw.surgery.name ?? "");
  const prom = normalizePromInstruments(raw.promInstruments);

  return {
    id: raw.id,
    subdomain: raw.subdomain,
    name: raw.name,
    birthDate: raw.birthDate || fallback?.birthDate || "",
    age: raw.age,
    sex: raw.sex,
    diagnosis: raw.diagnosis,
    surgery: {
      type: surgeryType,
      name: raw.surgery.name,
      nameKo: raw.surgery.nameKo,
      abbreviation: raw.surgery.abbreviation,
      date: raw.surgery.date,
      categories: raw.surgery.categories,
      schedule: raw.surgery.schedule,
    },
    admission: raw.admission,
    hospital: raw.hospital,
    surgeon: raw.surgeon,
    promInstruments: prom.length > 0 ? prom : fallback?.promInstruments ?? [],
    followUps: buildFollowUpsFromTemplate(raw.surgery.date, surgeryType),
    stages: buildStagesFromTemplate(raw.surgery.date, surgeryType),
  };
}

function getPatientApiUrl(subdomain?: string): string | null {
  if (typeof window === "undefined") return null;
  const host = window.location.hostname;
  const hasNumericSubdomain = /^\d+\./.test(host);

  if (hasNumericSubdomain) {
    return `${API_BASE}/api/patient`;
  }
  if (!subdomain) {
    return null;
  }
  return `${API_BASE}/api/patient?ptno=${encodeURIComponent(subdomain)}`;
}

export function usePatientData(id: string): { patient: Patient | null; loading: boolean } {
  const [patient, setPatient] = useState<Patient | null>(() => getPatientById(id) ?? null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fallback = getPatientById(id) ?? null;
    setPatient(fallback);

    const apiUrl = getPatientApiUrl(fallback?.subdomain);
    if (!apiUrl) return;
    const endpoint = apiUrl;

    let cancelled = false;
    setLoading(true);

    async function run() {
      try {
        const res = await fetch(endpoint);
        if (!res.ok) return;
        const data = (await res.json()) as WorkerPatientResponse;
        if (!data.patient || cancelled) return;

        const converted = buildPatientFromWorker(data.patient, fallback);
        if (!cancelled) setPatient(converted);
      } catch {
        // Keep fallback mock data on network errors.
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    run();
    return () => {
      cancelled = true;
    };
  }, [id]);

  return { patient, loading };
}
