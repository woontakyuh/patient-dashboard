"use client";

import { ReactNode, useEffect, useMemo, useState } from "react";
import { logAuditEvent } from "@/lib/audit-log";
import { usePatientData } from "@/lib/usePatientData";

const SESSION_HOURS = 12;

function normalizeBirthPrefix(raw: string): string {
  const digits = raw.replace(/\D/g, "");
  if (digits.length === 6) return digits;
  if (
    digits.length >= 8 &&
    (raw.includes("-") ||
      raw.includes("/") ||
      raw.includes(".") ||
      digits.startsWith("19") ||
      digits.startsWith("20"))
  ) {
    return digits.slice(2, 8);
  }
  return digits.slice(0, 6);
}

export default function PatientAccessGate({
  patientId,
  children,
}: {
  patientId: string;
  children: ReactNode;
}) {
  const { patient, loading } = usePatientData(patientId);
  const storageKey = useMemo(() => `patient-access-v1-${patientId}`, [patientId]);

  const [checking, setChecking] = useState(true);
  const [granted, setGranted] = useState(false);
  const [birthPrefixInput, setBirthPrefixInput] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!patient) {
      setChecking(false);
      return;
    }
    try {
      const raw = localStorage.getItem(storageKey);
      if (raw) {
        const parsed = JSON.parse(raw) as { expiresAt?: number };
        if (parsed.expiresAt && parsed.expiresAt > Date.now()) {
          setGranted(true);
        } else {
          localStorage.removeItem(storageKey);
        }
      }
    } catch {
      localStorage.removeItem(storageKey);
    } finally {
      setChecking(false);
    }
  }, [patient, storageKey]);

  function tryAuthenticate(birth6: string) {
    if (!patient || submitting) return;

    const expectedBirth6 = normalizeBirthPrefix(patient.birthDate ?? "");
    if (!expectedBirth6) {
      setError("환자 생년월일 정보가 등록되지 않았습니다. 병원에 문의해주세요.");
      return;
    }

    setSubmitting(true);
    const birthMatched = birth6 === expectedBirth6;

    if (!birthMatched) {
      setError("주민등록번호 앞 6자리가 일치하지 않습니다.");
      logAuditEvent({
        type: "auth_failure",
        patientId,
        detail: "Birth prefix mismatch",
        timestamp: new Date().toISOString(),
      });
      setSubmitting(false);
      return;
    }

    const expiresAt = Date.now() + SESSION_HOURS * 60 * 60 * 1000;
    localStorage.setItem(storageKey, JSON.stringify({ expiresAt }));
    setGranted(true);
    setError(null);
    logAuditEvent({
      type: "auth_success",
      patientId,
      detail: "Patient access granted",
      timestamp: new Date().toISOString(),
    });
    setSubmitting(false);
  }

  if (checking || loading) {
    return (
      <div className="min-h-[60vh] grid place-items-center">
        <p className="text-sm text-gray-500">접속 정보를 확인 중입니다...</p>
      </div>
    );
  }

  if (!patient || granted) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-1">
      <div className="w-full max-w-sm bg-white rounded-2xl border border-gray-200 shadow-sm p-5">
        <h1 className="text-lg font-bold text-gray-900">환자 전용 페이지 인증</h1>
        <p className="text-xs text-gray-500 mt-1">
          QR 접속 후 이름을 확인하고 주민등록번호 앞 6자리를 입력해주세요.
        </p>

        <div className="space-y-3 mt-4">
          <div className="rounded-lg bg-gray-50 border border-gray-200 px-3 py-2">
            <p className="text-[11px] text-gray-500">이름</p>
            <p className="text-base font-semibold text-gray-900">{patient.name}</p>
          </div>

          <label className="block">
            <span className="text-xs text-gray-500">주민등록번호 앞 6자리 (YYMMDD)</span>
            <input
              type="text"
              value={birthPrefixInput}
              onChange={(e) => {
                const next = e.target.value.replace(/\D/g, "").slice(0, 6);
                setBirthPrefixInput(next);
                if (error) setError(null);
                if (next.length === 6) {
                  tryAuthenticate(next);
                }
              }}
              inputMode="numeric"
              pattern="[0-9]*"
              autoComplete="one-time-code"
              autoFocus
              placeholder="예: 430226"
              className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-3 text-2xl tracking-[0.18em] text-center font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-teal-200"
            />
          </label>

          <p className="text-[11px] text-gray-400 text-center">
            6자리 입력 시 자동으로 대시보드가 열립니다.
          </p>

          {error && <p className="text-xs text-red-600">{error}</p>}

          <p className="text-[11px] text-gray-400 text-center">
            인증 상태는 12시간 유지됩니다.
          </p>
        </div>
      </div>
    </div>
  );
}
