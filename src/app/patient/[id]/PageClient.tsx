"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { getPatientById } from "@/data/mock-patient";
import PatientCharacter, { SelfieCapture } from "@/components/avatar/PatientCharacter";
import { formatDate, dDay } from "@/lib/utils";
import {
  JOURNEY_STAGES,
  computeJourneyStage,
  getJourneyStageStatus,
  getJourneyProgress,
} from "@/data/journey-stages";
import type { JourneyStageId } from "@/lib/types";
import {
  ClipboardCheck,
  Stethoscope,
  Bed,
  Footprints,
  TrendingUp,
  Award,
  Check,
  Lock,
  ChevronDown,
  ChevronUp,
  BookOpen,
  MessageCircle,
  AlertTriangle,
} from "lucide-react";

// lucide icon lookup
const STAGE_ICONS: Record<string, React.ElementType> = {
  ClipboardCheck,
  Stethoscope,
  Bed,
  Footprints,
  TrendingUp,
  Award,
};

export default function PageClient({ id }: { id: string }) {
  const patient = getPatientById(id);
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [checklist, setChecklist] = useState<Record<string, boolean>>({});
  const [expandedStage, setExpandedStage] = useState<JourneyStageId | null>(null);

  const AVATAR_KEY = `patient-avatar-${id}`;
  const CHECKLIST_KEY = `patient-checklist-v2-${id}`;

  const currentJourneyId = patient ? computeJourneyStage(patient.surgery.date) : "decision";

  useEffect(() => {
    setPhotoUrl(localStorage.getItem(AVATAR_KEY));
    try {
      const saved = localStorage.getItem(CHECKLIST_KEY);
      if (saved) setChecklist(JSON.parse(saved));
    } catch {
      /* ignore */
    }
  }, [AVATAR_KEY, CHECKLIST_KEY]);

  // Auto-expand current stage on first render
  useEffect(() => {
    setExpandedStage(currentJourneyId);
  }, [currentJourneyId]);

  if (!patient) {
    return (
      <div className="animate-fade-in p-6 text-center">
        <p className="text-gray-500">환자 정보를 찾을 수 없습니다.</p>
      </div>
    );
  }

  const progress = getJourneyProgress(patient.surgery.date);
  const nextFollowUp = patient.followUps.find(
    (f) => new Date(f.date) > new Date()
  );

  function toggleCheck(key: string) {
    setChecklist((prev) => {
      const updated = { ...prev, [key]: !prev[key] };
      localStorage.setItem(CHECKLIST_KEY, JSON.stringify(updated));
      return updated;
    });
  }

  const currentStage = patient.stages.find((s) => s.status === "current");

  return (
    <div className="animate-fade-in space-y-4">
      {/* ── Patient Summary Card ── */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
        <div className="flex items-start gap-3">
          <PatientCharacter
            photoUrl={photoUrl}
            size={56}
            mood={
              currentJourneyId === "full_recovery"
                ? "happy"
                : currentJourneyId === "surgery"
                  ? "hospital"
                  : "recovering"
            }
            showBrace={
              currentJourneyId !== "decision" &&
              currentJourneyId !== "full_recovery"
            }
          />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold text-gray-900">
                {patient.name}
              </h1>
              <span className="text-xs text-gray-400">{patient.age}세</span>
            </div>
            <p className="text-xs text-gray-500 mt-0.5">
              {patient.diagnosis.nameKo}
            </p>
            <p className="text-xs text-gray-400">{patient.surgery.nameKo}</p>
            <div className="flex items-center gap-2 mt-1.5">
              <span className="text-xs text-gray-400">수술일</span>
              <span className="text-xs font-medium text-gray-700">
                {formatDate(patient.surgery.date)}
              </span>
              <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-teal-100 text-teal-700">
                {dDay(patient.surgery.date)}
              </span>
            </div>
          </div>
        </div>
        <SelfieCapture onCapture={(url) => setPhotoUrl(url)} />
      </div>

      {/* ── Progress Bar ── */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-navy-500">
            나의 수술 여정
          </span>
          <span className="text-xs font-bold text-teal-600">{progress}%</span>
        </div>
        <div className="w-full bg-gray-100 rounded-full h-2.5">
          <div
            className="bg-gradient-to-r from-teal-400 to-teal-600 h-2.5 rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* ── Next Follow-up ── */}
      {nextFollowUp && (
        <div className="bg-gradient-to-r from-navy-500 to-teal-500 rounded-2xl p-4 text-white">
          <p className="text-xs opacity-80">다음 외래 예약</p>
          <div className="flex items-center justify-between mt-1">
            <div>
              <p className="text-base font-bold">{nextFollowUp.label}</p>
              <p className="text-xs opacity-80">
                {formatDate(nextFollowUp.date)}
              </p>
            </div>
            <p className="text-2xl font-bold">{dDay(nextFollowUp.date)}</p>
          </div>
        </div>
      )}

      {/* ── Journey Timeline ── */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
        <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">
          수술 여정 타임라인
        </h2>

        <div className="relative">
          {JOURNEY_STAGES.map((stage, i) => {
            const status = getJourneyStageStatus(stage.id, currentJourneyId);
            const isExpanded = expandedStage === stage.id;
            const isLast = i === JOURNEY_STAGES.length - 1;
            const IconComponent = STAGE_ICONS[stage.icon] || ClipboardCheck;

            return (
              <div key={stage.id} className="flex">
                {/* Timeline line + node */}
                <div className="flex flex-col items-center mr-3 relative">
                  <button
                    onClick={() =>
                      setExpandedStage(isExpanded ? null : stage.id)
                    }
                    className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 transition-all ${
                      status === "completed"
                        ? "bg-green-500 text-white"
                        : status === "current"
                          ? "bg-teal-500 text-white ring-4 ring-teal-100 animate-pulse"
                          : "bg-gray-200 text-gray-400"
                    }`}
                  >
                    {status === "completed" ? (
                      <Check className="w-5 h-5" />
                    ) : status === "upcoming" ? (
                      <Lock className="w-4 h-4" />
                    ) : (
                      <IconComponent className="w-5 h-5" />
                    )}
                  </button>
                  {!isLast && (
                    <div
                      className={`w-0.5 flex-1 min-h-[24px] ${
                        status === "completed" ? "bg-green-400" : "bg-gray-200"
                      }`}
                    />
                  )}
                </div>

                {/* Content */}
                <div className={`flex-1 pb-4 ${isLast ? "pb-0" : ""}`}>
                  <button
                    onClick={() =>
                      setExpandedStage(isExpanded ? null : stage.id)
                    }
                    className="w-full text-left"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p
                          className={`text-sm font-semibold ${
                            status === "completed"
                              ? "text-green-700"
                              : status === "current"
                                ? "text-teal-700"
                                : "text-gray-400"
                          }`}
                        >
                          {stage.titleKo}
                        </p>
                        <p className="text-[10px] text-gray-400 mt-0.5">
                          {stage.subtitle}
                        </p>
                      </div>
                      {status !== "upcoming" &&
                        (isExpanded ? (
                          <ChevronUp className="w-4 h-4 text-gray-400" />
                        ) : (
                          <ChevronDown className="w-4 h-4 text-gray-400" />
                        ))}
                    </div>
                  </button>

                  {/* Expanded panel */}
                  {isExpanded && status !== "upcoming" && (
                    <div className="mt-2 space-y-3 animate-fade-in">
                      <p className="text-xs text-gray-600">
                        {stage.description}
                      </p>

                      {/* Tasks checklist */}
                      <div className="space-y-1.5">
                        {stage.tasks.map((task, ti) => {
                          const key = `journey-${stage.id}-${ti}`;
                          const checked = !!checklist[key];
                          return (
                            <button
                              key={ti}
                              onClick={() => toggleCheck(key)}
                              className={`w-full flex items-start gap-2 p-2 rounded-lg text-xs text-left transition-colors ${
                                checked ? "bg-green-50" : "hover:bg-gray-50"
                              }`}
                            >
                              <span
                                className={`mt-0.5 w-4 h-4 rounded border-2 flex-shrink-0 flex items-center justify-center transition-colors ${
                                  checked
                                    ? "bg-green-500 border-green-500 text-white"
                                    : "border-gray-300"
                                }`}
                              >
                                {checked && <Check className="w-2.5 h-2.5" />}
                              </span>
                              <span
                                className={
                                  checked
                                    ? "text-gray-400 line-through"
                                    : "text-gray-700"
                                }
                              >
                                {task}
                              </span>
                            </button>
                          );
                        })}
                      </div>

                      {/* Quick links */}
                      <div className="flex gap-2">
                        {currentStage &&
                          stage.clinicalStageIds.includes(currentStage.id) && (
                            <Link
                              href={`/patient/${patient.id}/instructions/${currentStage.id}`}
                              className="flex items-center gap-1 px-2.5 py-1.5 bg-teal-50 text-teal-700 rounded-lg text-[10px] font-semibold hover:bg-teal-100 transition-colors"
                            >
                              <BookOpen className="w-3 h-3" />
                              상세 안내
                            </Link>
                          )}
                        <Link
                          href={`/patient/${patient.id}/education`}
                          className="flex items-center gap-1 px-2.5 py-1.5 bg-navy-50 text-navy-500 rounded-lg text-[10px] font-semibold hover:bg-navy-100 transition-colors"
                        >
                          <BookOpen className="w-3 h-3" />
                          교육 자료
                        </Link>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Current Stage Warnings ── */}
      {currentStage && currentStage.warnings.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4">
          <h3 className="text-xs font-semibold text-amber-700 mb-2 flex items-center gap-1.5">
            <AlertTriangle className="w-3.5 h-3.5" />
            주의사항
          </h3>
          <ul className="space-y-1">
            {currentStage.warnings.map((w, i) => (
              <li key={i} className="text-xs text-amber-700">
                &bull; {w}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* ── Quick Actions ── */}
      <div className="grid grid-cols-2 gap-3">
        <Link
          href={`/patient/${patient.id}/chat`}
          className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 hover:border-teal-200 transition-colors"
        >
          <MessageCircle className="w-6 h-6 text-teal-500 mb-2" />
          <p className="text-sm font-semibold text-gray-900">AI 상담</p>
          <p className="text-[10px] text-gray-400 mt-0.5">
            궁금한 점을 물어보세요
          </p>
        </Link>
        <Link
          href={`/patient/${patient.id}/education`}
          className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 hover:border-navy-200 transition-colors"
        >
          <BookOpen className="w-6 h-6 text-navy-400 mb-2" />
          <p className="text-sm font-semibold text-gray-900">교육 자료</p>
          <p className="text-[10px] text-gray-400 mt-0.5">
            단계별 안내를 확인하세요
          </p>
        </Link>
      </div>
    </div>
  );
}
