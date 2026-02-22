"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import type { Patient, PromTrendPoint } from "./types";

interface PatientContextValue {
  patient: Patient | null;
  promTrend: PromTrendPoint[];
  loading: boolean;
  error: string | null;
}

const PatientContext = createContext<PatientContextValue>({
  patient: null,
  promTrend: [],
  loading: true,
  error: null,
});

export function usePatient() {
  return useContext(PatientContext);
}

export function PatientProvider({ children }: { children: ReactNode }) {
  const [patient, setPatient] = useState<Patient | null>(null);
  const [promTrend, setPromTrend] = useState<PromTrendPoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/patient");
        if (res.status === 404) {
          setError("notfound");
          return;
        }
        if (!res.ok) {
          setError("서버 오류가 발생했습니다.");
          return;
        }
        const data = await res.json();
        setPatient(data.patient);
        setPromTrend(data.promTrend || []);
      } catch {
        setError("데이터를 불러올 수 없습니다.");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  return (
    <PatientContext.Provider value={{ patient, promTrend, loading, error }}>
      {children}
    </PatientContext.Provider>
  );
}
