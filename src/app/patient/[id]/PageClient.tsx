"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import Link from "next/link";
import { getPatientById } from "@/data/mock-patient";
import { getSurgeryTemplate } from "@/data/surgery-templates";
import PatientCharacter, { SelfieCapture } from "@/components/avatar/PatientCharacter";
import SpineAvatar from "@/components/avatar/SpineAvatar";
import { ClinicalStage, DaySchedule } from "@/lib/types";
import { formatDate, dDay } from "@/lib/utils";

function addDays(dateStr: string, days: number): string {
  const d = new Date(dateStr);
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

export default function PageClient({ id }: { id: string }) {
  const patient = getPatientById(id);
  const [discharged, setDischarged] = useState(false);
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [showDischargeConfirm, setShowDischargeConfirm] = useState(false);
  const [checklist, setChecklist] = useState<Record<string, boolean>>({});

  const DISCHARGE_KEY = `patient-discharged-${id}`;
  const AVATAR_KEY = `patient-avatar-${id}`;
  const CHECKLIST_KEY = `patient-checklist-${id}`;

  // Build inpatient schedule from template
  const inpatientSchedule = useMemo<DaySchedule[]>(() => {
    if (!patient) return [];
    const template = getSurgeryTemplate(patient.surgery.type);
    return template.inpatientSchedule.map((day) => ({
      day: day.day,
      label: addDays(patient.surgery.date, day.dateOffset),
      rows: day.rows,
    }));
  }, [patient]);

  useEffect(() => {
    setDischarged(localStorage.getItem(DISCHARGE_KEY) === "true");
    setPhotoUrl(localStorage.getItem(AVATAR_KEY));
    try {
      const saved = localStorage.getItem(CHECKLIST_KEY);
      if (saved) setChecklist(JSON.parse(saved));
    } catch { /* ignore */ }
  }, [DISCHARGE_KEY, AVATAR_KEY, CHECKLIST_KEY]);

  if (!patient) {
    return (
      <div className="animate-fade-in p-6 text-center">
        <p className="text-gray-500">환자 정보를 찾을 수 없습니다.</p>
      </div>
    );
  }

  const inpatientStages = patient.stages.filter((s) => s.phase === "inpatient");
  const outpatientStages = patient.stages.filter((s) => s.phase === "outpatient");
  const currentStage = patient.stages.find((s) => s.status === "current");

  function handleDischarge() {
    localStorage.setItem(DISCHARGE_KEY, "true");
    setDischarged(true);
    setShowDischargeConfirm(false);
  }

  function handleUndoDischarge() {
    localStorage.removeItem(DISCHARGE_KEY);
    setDischarged(false);
  }

  function toggleCheck(key: string) {
    setChecklist((prev) => {
      const updated = { ...prev, [key]: !prev[key] };
      localStorage.setItem(CHECKLIST_KEY, JSON.stringify(updated));
      return updated;
    });
  }

  // Post-op months calculation
  const surgeryDate = new Date(patient.surgery.date);
  const now = new Date();
  const postOpMonths = Math.max(
    0,
    Math.floor((now.getTime() - surgeryDate.getTime()) / (1000 * 60 * 60 * 24 * 30))
  );

  // Next follow-up
  const nextFollowUp = patient.followUps.find((f) => new Date(f.date) > now);

  return (
    <div className="animate-fade-in space-y-4">
      {/* ── Patient Summary (Compact) ── */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
        <div className="flex items-start gap-3">
          <PatientCharacter
            photoUrl={photoUrl}
            size={60}
            mood={discharged ? "recovering" : "hospital"}
            showBrace={!discharged}
          />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold text-gray-900">{patient.name}</h1>
              <span className="text-xs text-gray-400">{patient.age}세</span>
            </div>
            <p className="text-xs text-gray-500 mt-0.5">{patient.diagnosis.nameKo}</p>
            <p className="text-xs text-gray-400">{patient.surgery.nameKo}</p>
            <div className="flex items-center gap-2 mt-1.5">
              <span className="text-xs text-gray-400">수술일</span>
              <span className="text-xs font-medium text-gray-700">
                {formatDate(patient.surgery.date)}
              </span>
              <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-700">
                {dDay(patient.surgery.date)}
              </span>
            </div>
            {discharged && (
              <span className="inline-flex items-center mt-1.5 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-green-100 text-green-700">
                퇴원 완료 &middot; 수술 후 {postOpMonths}개월
              </span>
            )}
          </div>
        </div>
        <SelfieCapture onCapture={(url) => setPhotoUrl(url)} />
      </div>

      {/* ── D-day Card (Next Follow-up) ── */}
      {discharged && nextFollowUp && (
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl p-4 text-white">
          <p className="text-xs opacity-80">다음 외래 예약</p>
          <div className="flex items-center justify-between mt-1">
            <div>
              <p className="text-lg font-bold">{nextFollowUp.label}</p>
              <p className="text-xs opacity-80">{formatDate(nextFollowUp.date)}</p>
            </div>
            <div className="text-right">
              <p className="text-3xl font-bold">{dDay(nextFollowUp.date)}</p>
            </div>
          </div>
        </div>
      )}

      {/* ── Current Stage Badge ── */}
      {currentStage && !discharged && (
        <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4">
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
            <span className="text-xs font-semibold text-blue-600">현재 단계</span>
          </div>
          <Link
            href={`/patient/${patient.id}/instructions/${currentStage.id}`}
            className="text-sm font-bold text-blue-800 hover:underline"
          >
            {currentStage.title} &rarr;
          </Link>
        </div>
      )}

      {/* ── Inpatient Journey (shown when not discharged) ── */}
      {!discharged && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
          <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
            입원 중 수술 경로
          </h2>
          <InpatientTimeline
            stages={inpatientStages}
            patientId={patient.id}
            photoUrl={photoUrl}
          />

          {/* Discharge button */}
          <div className="mt-4 pt-3 border-t border-gray-100">
            {!showDischargeConfirm ? (
              <button
                onClick={() => setShowDischargeConfirm(true)}
                className="w-full px-4 py-2.5 bg-green-600 text-white rounded-xl text-sm font-semibold hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3" />
                </svg>
                퇴원하기
              </button>
            ) : (
              <div className="bg-green-50 border border-green-200 rounded-xl p-3">
                <p className="text-sm text-green-800 font-medium mb-2">퇴원 처리를 하시겠습니까?</p>
                <div className="flex gap-2">
                  <button onClick={handleDischarge} className="px-3 py-1.5 bg-green-600 text-white rounded-lg text-xs font-medium hover:bg-green-700">
                    네, 퇴원합니다
                  </button>
                  <button onClick={() => setShowDischargeConfirm(false)} className="px-3 py-1.5 bg-white border border-gray-200 text-gray-600 rounded-lg text-xs font-medium hover:bg-gray-50">
                    취소
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── Inpatient Schedule Summary ── */}
      {!discharged && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
          <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
            입원 일정 요약
          </h2>
          <div className="space-y-4">
            {inpatientSchedule.map((day) => (
              <div key={day.day}>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-sm font-bold text-gray-800">{day.day}</span>
                  <span className="text-[10px] text-gray-400">{formatDate(day.label)}</span>
                </div>
                <div className="space-y-1">
                  {day.rows.map((row, i) => (
                    <div key={i} className="flex items-start gap-2 text-sm py-1.5 px-2 rounded-lg hover:bg-gray-50">
                      <span className="text-base flex-shrink-0">{row.icon}</span>
                      <div className="flex-1 min-w-0">
                        <span className="text-gray-700">{row.activity}</span>
                      </div>
                      <span className="text-[10px] text-gray-400 flex-shrink-0">{row.time}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Checklist (Dos from current stage) ── */}
      {currentStage && !discharged && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
              오늘의 체크리스트
            </h2>
            <Link
              href={`/patient/${patient.id}/instructions/${currentStage.id}`}
              className="text-xs text-blue-600 font-medium hover:underline"
            >
              자세히 &rarr;
            </Link>
          </div>
          <ul className="space-y-2">
            {currentStage.dos.map((item, i) => {
              const key = `${currentStage.id}-do-${i}`;
              const checked = !!checklist[key];
              return (
                <li key={i}>
                  <button
                    onClick={() => toggleCheck(key)}
                    className={`w-full flex items-start gap-2.5 p-2.5 rounded-lg text-sm text-left transition-colors ${
                      checked ? "bg-green-50" : "hover:bg-gray-50"
                    }`}
                  >
                    <span className={`mt-0.5 w-5 h-5 rounded border-2 flex-shrink-0 flex items-center justify-center transition-colors ${
                      checked ? "bg-green-500 border-green-500 text-white" : "border-gray-300"
                    }`}>
                      {checked && (
                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </span>
                    <span className={checked ? "text-gray-400 line-through" : "text-gray-700"}>
                      {item}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>

          {/* Warnings */}
          {currentStage.warnings.length > 0 && (
            <div className="mt-3 bg-amber-50/50 border border-amber-100 rounded-xl p-3">
              <h3 className="text-xs font-semibold text-amber-700 mb-1.5 flex items-center gap-1">
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                주의사항
              </h3>
              <ul className="space-y-1">
                {currentStage.warnings.map((w, i) => (
                  <li key={i} className="text-xs text-amber-700">&bull; {w}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* ── Post-Discharge Outpatient View ── */}
      {discharged && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
              외래 추적 일정
            </h2>
            <button
              onClick={handleUndoDischarge}
              className="text-[10px] text-gray-400 hover:text-gray-600 transition-colors"
            >
              입원 화면으로
            </button>
          </div>

          <div className="flex flex-col items-center mb-5">
            <PatientCharacter photoUrl={photoUrl} size={100} mood="happy" showBrace={false} />
            <p className="mt-2 text-lg font-bold text-blue-600">수술 후 {postOpMonths}개월</p>
            <p className="text-xs text-gray-400">{patient.surgery.nameKo} ({formatDate(patient.surgery.date)})</p>
          </div>

          <div className="space-y-2">
            {outpatientStages.map((stage) => {
              const stageDate = stage.date ? new Date(stage.date) : null;
              const isPast = stageDate && stageDate < now;
              return (
                <Link
                  key={stage.id}
                  href={`/patient/${patient.id}/instructions/${stage.id}`}
                  className={`flex items-center gap-3 p-3 rounded-xl border transition-all hover:shadow-sm ${
                    isPast
                      ? "bg-green-50 border-green-200"
                      : "bg-white border-gray-200 hover:border-blue-200"
                  }`}
                >
                  <span className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${isPast ? "bg-green-500" : "bg-gray-300"}`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900">{stage.title}</p>
                    {stage.date && <p className="text-[10px] text-gray-400">{formatDate(stage.date)}</p>}
                  </div>
                  {stage.date && !isPast && (
                    <span className="text-xs font-medium text-blue-600">{dDay(stage.date)}</span>
                  )}
                  {isPast && (
                    <svg className="w-4 h-4 text-green-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </Link>
              );
            })}
          </div>
        </div>
      )}

      {/* Spine diagram - mobile */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
        <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
          수술 부위
        </h2>
        <div className="flex justify-center">
          <SpineAvatar surgeryLevel={patient.diagnosis.code} />
        </div>
      </div>
    </div>
  );
}

// ── Inpatient Timeline ──
function InpatientTimeline({
  stages,
  patientId,
  photoUrl,
}: {
  stages: ClinicalStage[];
  patientId: string;
  photoUrl: string | null;
}) {
  const currentNodeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (currentNodeRef.current) {
      currentNodeRef.current.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  }, []);

  return (
    <div className="relative">
      {/* Vertical timeline */}
      <div className="space-y-0">
        {stages.map((stage, i) => {
          const isLast = i === stages.length - 1;
          const isCurrent = stage.status === "current";
          const isCompleted = stage.status === "completed";

          return (
            <div key={stage.id} className="flex" ref={isCurrent ? currentNodeRef : undefined}>
              <div className="flex flex-col items-center mr-3 relative">
                {isCurrent && (
                  <div className="absolute -left-7 -top-0.5 z-10">
                    <div className="animate-walk">
                      <PatientCharacter photoUrl={photoUrl} size={32} mood="hospital" />
                    </div>
                  </div>
                )}
                <Link href={`/patient/${patientId}/instructions/${stage.id}`}>
                  <div
                    className={`w-8 h-8 rounded-full border-2 flex items-center justify-center text-white text-xs transition-transform hover:scale-110 ${
                      isCompleted ? "bg-green-500 border-green-600" :
                      isCurrent ? "bg-blue-600 border-blue-700 animate-pulse-ring" :
                      "bg-gray-300 border-gray-400"
                    }`}
                  >
                    {isCompleted ? (
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      <span className="text-[10px] font-bold">{i + 1}</span>
                    )}
                  </div>
                </Link>
                {!isLast && (
                  <div className={`w-0.5 h-8 ${isCompleted ? "bg-green-400" : "bg-gray-200"}`} />
                )}
              </div>
              <Link
                href={`/patient/${patientId}/instructions/${stage.id}`}
                className="flex-1 pb-3 group"
              >
                <p className={`text-sm leading-tight group-hover:underline ${
                  isCompleted ? "text-green-700 font-medium" :
                  isCurrent ? "text-blue-700 font-bold" :
                  "text-gray-500"
                }`}>
                  {stage.title}
                </p>
                {stage.date && (
                  <p className="text-[10px] text-gray-400 mt-0.5">{formatDate(stage.date)}</p>
                )}
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
}
