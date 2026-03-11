"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import PatientCharacter, { AvatarProfile } from "@/components/avatar/PatientCharacter";
import { formatDate, dDay } from "@/lib/utils";
import { getSurgeryTypeLabel } from "@/lib/surgery-classifier";
import { usePatientData } from "@/lib/usePatientData";
import {
  JOURNEY_STAGES,
  computeJourneyStage,
  getJourneyStageStatus,
  getJourneyProgress,
} from "@/data/journey-stages";
import { getNextMicroPromCheckpoint } from "@/data/micro-prom-schedule";
import type { JourneyStageId, PromInstrumentId } from "@/lib/types";
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
  AlertTriangle,
  BellRing,
  ClipboardList,
  LineChart,
} from "lucide-react";

const STAGE_ICONS: Record<string, React.ElementType> = {
  ClipboardCheck,
  Stethoscope,
  Bed,
  Footprints,
  TrendingUp,
  Award,
};

const PROM_LABELS: Record<PromInstrumentId, string> = {
  vas: "통증 정도",
  odi: "허리 기능",
  ndi: "목 기능",
  joa: "신경 기능",
  eq5d: "일상 기능",
  eqvas: "전반적 건강",
};

function buildAvatarProfile(age: number, sex: "M" | "F"): AvatarProfile {
  const ageGroup: AvatarProfile["ageGroup"] = age >= 70 ? "senior" : age >= 40 ? "middle" : "young";
  return {
    sex,
    ageGroup,
    hairStyle: sex === "F" ? "long" : age >= 70 ? "bald" : "short",
    glasses: age >= 65,
  };
}

export default function PageClient({ id }: { id: string }) {
  const { patient } = usePatientData(id);
  const [checklist, setChecklist] = useState<Record<string, boolean>>({});
  const [expandedStage, setExpandedStage] = useState<JourneyStageId | null>(null);

  const CHECKLIST_KEY = `patient-checklist-v2-${id}`;

  const currentJourneyId = patient ? computeJourneyStage(patient.surgery.date) : "decision";

  useEffect(() => {
    try {
      const saved = localStorage.getItem(CHECKLIST_KEY);
      if (saved) setChecklist(JSON.parse(saved));
    } catch {
      // ignore malformed local storage
    }
  }, [CHECKLIST_KEY]);

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

  const avatarProfile = buildAvatarProfile(patient.age, patient.sex);

  const progress = getJourneyProgress(patient.surgery.date);
  const nextMicroProm = getNextMicroPromCheckpoint(patient.surgery.date);
  const nextFollowUp = patient.followUps.find((f) => new Date(f.date) > new Date());

  function toggleCheck(key: string) {
    setChecklist((prev) => {
      const updated = { ...prev, [key]: !prev[key] };
      localStorage.setItem(CHECKLIST_KEY, JSON.stringify(updated));
      return updated;
    });
  }

  const currentStage = patient.stages.find((s) => s.status === "current");
  const currentJourneyStage = JOURNEY_STAGES.find((stage) => stage.id === currentJourneyId);
  const currentJourneyTasks = (currentJourneyStage?.tasks ?? []).map((task, index) => ({
    key: `journey-${currentJourneyId}-${index}`,
    task,
  }));
  const todayTodo = currentJourneyTasks.find((item) => !checklist[item.key]) ?? null;
  const allTodayTasksDone =
    currentJourneyTasks.length > 0 &&
    currentJourneyTasks.every((item) => checklist[item.key]);
  const todayTaskHref = todayTodo
    ? todayTodo.task.includes("설문")
      ? `/patient/${patient.id}/prom`
      : currentStage
        ? `/patient/${patient.id}/instructions/${currentStage.id}`
        : `/patient/${patient.id}/timeline`
    : null;

  return (
    <div className="animate-fade-in space-y-4">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
        <div className="flex items-start gap-3">
          <PatientCharacter
            size={56}
            profile={avatarProfile}
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
              <h1 className="text-lg font-bold text-gray-900">{patient.name}</h1>
              <span className="text-xs text-gray-400">{patient.age}세</span>
            </div>
            <p className="text-xs text-gray-500 mt-0.5">{patient.diagnosis.nameKo}</p>
            <p className="text-xs text-gray-400">{patient.surgery.nameKo}</p>
            <p className="text-[10px] text-teal-700 bg-teal-50 border border-teal-100 rounded-full inline-flex px-2 py-0.5 mt-1">
              {getSurgeryTypeLabel(patient.surgery.type)}
            </p>
            <div className="flex items-center gap-2 mt-1.5">
              <span className="text-xs text-gray-400">수술일</span>
              <span className="text-xs font-medium text-gray-700">{formatDate(patient.surgery.date)}</span>
              <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-teal-100 text-teal-700">
                {dDay(patient.surgery.date)}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-navy-500">나의 수술 여정</span>
          <span className="text-xs font-bold text-teal-600">{progress}%</span>
        </div>
        <div className="w-full bg-gray-100 rounded-full h-2.5">
          <div
            className="bg-gradient-to-r from-teal-400 to-teal-600 h-2.5 rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
        <div className="flex items-center justify-between">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">오늘 할 일 1개</p>
          <span
            className={`text-[10px] px-2 py-0.5 rounded-full border ${
              todayTodo
                ? "text-orange-700 bg-orange-50 border-orange-200"
                : "text-emerald-700 bg-emerald-50 border-emerald-200"
            }`}
          >
            {todayTodo ? "진행 중" : allTodayTasksDone ? "완료" : "확인 필요"}
          </span>
        </div>

        {todayTodo ? (
          <>
            <p className="mt-2 text-sm font-semibold text-gray-900">{todayTodo.task}</p>
            <p className="mt-1 text-xs text-gray-500">
              현재 단계: {currentJourneyStage?.titleKo ?? "수술 여정"}
            </p>
            <div className="flex gap-2 mt-3">
              <button
                onClick={() => toggleCheck(todayTodo.key)}
                className="px-3 py-1.5 rounded-lg bg-emerald-600 text-white text-xs font-semibold hover:bg-emerald-700 transition-colors"
              >
                완료 체크
              </button>
              {todayTaskHref && (
                <Link
                  href={todayTaskHref}
                  className="px-3 py-1.5 rounded-lg bg-gray-100 text-gray-700 text-xs font-semibold hover:bg-gray-200 transition-colors"
                >
                  자세히 보기
                </Link>
              )}
            </div>
          </>
        ) : (
          <>
            <p className="mt-2 text-sm font-semibold text-emerald-700">
              오늘 할 일을 모두 완료했어요.
            </p>
            <p className="mt-1 text-xs text-gray-500">
              {nextMicroProm
                ? `다음 체크포인트(${nextMicroProm.label})에 맞춰 회복 설문을 작성해주세요.`
                : "오늘은 충분히 쉬고 컨디션을 확인해주세요."}
            </p>
            {nextMicroProm && (
              <Link
                href={`/patient/${patient.id}/prom`}
                className="inline-flex mt-3 px-3 py-1.5 rounded-lg bg-blue-50 text-blue-700 text-xs font-semibold hover:bg-blue-100 transition-colors"
              >
                설문 작성하기
              </Link>
            )}
          </>
        )}
      </div>

      {nextFollowUp && (
        <div className="bg-gradient-to-r from-navy-500 to-teal-500 rounded-2xl p-4 text-white">
          <p className="text-xs opacity-80">다음 외래 예약</p>
          <div className="flex items-center justify-between mt-1">
            <div>
              <p className="text-base font-bold">{nextFollowUp.label}</p>
              <p className="text-xs opacity-80">{formatDate(nextFollowUp.date)}</p>
            </div>
            <p className="text-2xl font-bold">{dDay(nextFollowUp.date)}</p>
          </div>
        </div>
      )}

      {nextMicroProm && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
          <div className="flex items-center gap-2 mb-1">
            <BellRing className="w-4 h-4 text-blue-500" />
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
              회복 체크 설문
            </p>
          </div>
          <p className="text-sm font-semibold text-gray-900">다음 체크포인트: {nextMicroProm.label}</p>
          <p className="text-xs text-gray-500 mt-1">
            권장 항목: {nextMicroProm.recommendedInstruments
              .filter((ins) => patient.promInstruments.includes(ins))
              .map((ins) => PROM_LABELS[ins])
              .join(", ")}
          </p>
          <Link
            href={`/patient/${patient.id}/prom`}
            className="inline-flex mt-2 text-[11px] font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 border border-blue-100 rounded-md px-2 py-1 transition-colors"
          >
            지금 작성하기
          </Link>
        </div>
      )}

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
                <div className="flex flex-col items-center mr-3 relative">
                  <button
                    onClick={() => setExpandedStage(isExpanded ? null : stage.id)}
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

                <div className={`flex-1 pb-4 ${isLast ? "pb-0" : ""}`}>
                  <button
                    onClick={() => setExpandedStage(isExpanded ? null : stage.id)}
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
                        <p className="text-[10px] text-gray-400 mt-0.5">{stage.subtitle}</p>
                      </div>
                      {status !== "upcoming" &&
                        (isExpanded ? (
                          <ChevronUp className="w-4 h-4 text-gray-400" />
                        ) : (
                          <ChevronDown className="w-4 h-4 text-gray-400" />
                        ))}
                    </div>
                  </button>

                  {isExpanded && status !== "upcoming" && (
                    <div className="mt-2 space-y-3 animate-fade-in">
                      <p className="text-xs text-gray-600">{stage.description}</p>

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
                              <span className={checked ? "text-gray-400 line-through" : "text-gray-700"}>
                                {task}
                              </span>
                            </button>
                          );
                        })}
                      </div>

                      <div className="flex gap-2">
                        {currentStage && stage.clinicalStageIds.includes(currentStage.id) && (
                          <Link
                            href={`/patient/${patient.id}/instructions/${currentStage.id}`}
                            className="flex items-center gap-1 px-2.5 py-1.5 bg-teal-50 text-teal-700 rounded-lg text-[10px] font-semibold hover:bg-teal-100 transition-colors"
                          >
                            <BookOpen className="w-3 h-3" />
                            상세 안내
                          </Link>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

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

      <div className="grid grid-cols-2 gap-3">
        <Link
          href={`/patient/${patient.id}/prom`}
          className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 hover:border-teal-200 transition-colors"
        >
          <ClipboardList className="w-6 h-6 text-teal-500 mb-2" />
          <p className="text-sm font-semibold text-gray-900">건강 설문</p>
          <p className="text-[10px] text-gray-400 mt-0.5">오늘 상태를 기록하세요</p>
        </Link>
        <Link
          href={`/patient/${patient.id}/progress`}
          className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 hover:border-navy-200 transition-colors"
        >
          <LineChart className="w-6 h-6 text-navy-400 mb-2" />
          <p className="text-sm font-semibold text-gray-900">회복 추이</p>
          <p className="text-[10px] text-gray-400 mt-0.5">회복 변화 확인</p>
        </Link>
      </div>
    </div>
  );
}
