"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { JOURNEY_STAGES, computeJourneyStage, getJourneyStageStatus } from "@/data/journey-stages";
import { getEducationByStage } from "@/data/education-content";
import type { JourneyStageId } from "@/lib/types";
import { usePatientData } from "@/lib/usePatientData";
import {
  BookOpen,
  Video,
  CheckSquare,
  FileText,
  Lock,
  Check,
  ChevronDown,
  ChevronUp,
  AlertTriangle,
  Clock,
  ExternalLink,
  MessageCircle,
} from "lucide-react";

const TYPE_ICONS: Record<string, React.ElementType> = {
  video: Video,
  article: FileText,
  checklist: CheckSquare,
};

const PRIORITY_COLORS = {
  essential: "bg-teal-100 text-teal-700",
  recommended: "bg-navy-50 text-navy-500",
  optional: "bg-gray-100 text-gray-500",
};

const PRIORITY_LABELS = {
  essential: "필수",
  recommended: "권장",
  optional: "선택",
};

export default function EducationClient({ id }: { id: string }) {
  const { patient } = usePatientData(id);
  const [completedItems, setCompletedItems] = useState<Record<string, boolean>>({});
  const [expandedStage, setExpandedStage] = useState<JourneyStageId | null>(null);

  const STORAGE_KEY = `education-completed-${id}`;
  const currentJourneyId = patient ? computeJourneyStage(patient.surgery.date) : "decision";

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) setCompletedItems(JSON.parse(saved));
    } catch { /* ignore */ }
  }, [STORAGE_KEY]);

  // Auto-expand current stage
  useEffect(() => {
    setExpandedStage(currentJourneyId);
  }, [currentJourneyId]);

  if (!patient) {
    return (
      <div className="p-6 text-center">
        <p className="text-gray-500">환자 정보를 찾을 수 없습니다.</p>
      </div>
    );
  }

  function toggleCompleted(itemId: string) {
    setCompletedItems((prev) => {
      const updated = { ...prev, [itemId]: !prev[itemId] };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  }

  // Count completed per stage
  function getStageProgress(stageId: JourneyStageId) {
    const items = getEducationByStage(stageId, patient?.surgery.type);
    const done = items.filter((item) => completedItems[item.id]).length;
    return { done, total: items.length };
  }

  return (
    <div className="animate-fade-in space-y-4">
      {/* Header */}
      <div className="flex items-center gap-2 mb-2">
        <BookOpen className="w-5 h-5 text-navy-500" />
        <h1 className="text-lg font-bold text-gray-900">교육 자료</h1>
      </div>
      <p className="text-xs text-gray-500">
        수술 여정 단계별 교육 콘텐츠입니다. 현재 단계까지의 자료를 확인할 수 있습니다.
      </p>

      {/* Stage Accordion */}
      {JOURNEY_STAGES.map((stage) => {
        const status = getJourneyStageStatus(stage.id, currentJourneyId);
        const isLocked = status === "upcoming";
        const isExpanded = expandedStage === stage.id;
        const items = getEducationByStage(stage.id, patient.surgery.type);
        const { done, total } = getStageProgress(stage.id);

        return (
          <div
            key={stage.id}
            className={`bg-white rounded-2xl shadow-sm border overflow-hidden transition-colors ${
              isLocked ? "border-gray-100 opacity-60" : "border-gray-100"
            }`}
          >
            {/* Stage Header */}
            <button
              onClick={() => !isLocked && setExpandedStage(isExpanded ? null : stage.id)}
              disabled={isLocked}
              className="w-full flex items-center gap-3 p-4 text-left"
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                  isLocked
                    ? "bg-gray-200 text-gray-400"
                    : status === "completed"
                      ? "bg-green-500 text-white"
                      : "bg-teal-500 text-white"
                }`}
              >
                {isLocked ? (
                  <Lock className="w-4 h-4" />
                ) : status === "completed" && done === total ? (
                  <Check className="w-4 h-4" />
                ) : (
                  <BookOpen className="w-4 h-4" />
                )}
              </div>

              <div className="flex-1 min-w-0">
                <p
                  className={`text-sm font-semibold ${
                    isLocked ? "text-gray-400" : "text-gray-900"
                  }`}
                >
                  {stage.titleKo}
                </p>
                <p className="text-[10px] text-gray-400">{stage.subtitle}</p>
              </div>

              {!isLocked && (
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-medium text-gray-400">
                    {done}/{total}
                  </span>
                  {isExpanded ? (
                    <ChevronUp className="w-4 h-4 text-gray-400" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-gray-400" />
                  )}
                </div>
              )}
            </button>

            {/* Expanded Content */}
            {isExpanded && !isLocked && (
              <div className="px-4 pb-4 space-y-2">
                {items.map((item) => {
                  const isDone = !!completedItems[item.id];
                  const TypeIcon = TYPE_ICONS[item.type] || FileText;

                  return (
                    <div
                      key={item.id}
                      className={`rounded-xl border p-3 transition-colors ${
                        item.redFlag
                          ? "border-red-200 bg-red-50/50"
                          : isDone
                            ? "border-green-200 bg-green-50/50"
                            : "border-gray-100 hover:border-gray-200"
                      }`}
                    >
                      <div className="flex items-start gap-2.5">
                        {/* Completion toggle */}
                        <button
                          onClick={() => toggleCompleted(item.id)}
                          className={`mt-0.5 w-5 h-5 rounded border-2 flex-shrink-0 flex items-center justify-center transition-colors ${
                            isDone
                              ? "bg-green-500 border-green-500 text-white"
                              : "border-gray-300 hover:border-gray-400"
                          }`}
                        >
                          {isDone && <Check className="w-3 h-3" />}
                        </button>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1.5 mb-1">
                            {item.redFlag && (
                              <AlertTriangle className="w-3.5 h-3.5 text-red-500 flex-shrink-0" />
                            )}
                            <p
                              className={`text-sm font-medium ${
                                isDone ? "text-gray-400 line-through" : "text-gray-900"
                              }`}
                            >
                              {item.title}
                            </p>
                          </div>

                          <p className="text-xs text-gray-500 mb-2">
                            {item.summary}
                          </p>

                          <div className="flex items-center gap-2">
                            <span className="flex items-center gap-1 text-[10px] text-gray-400">
                              <TypeIcon className="w-3 h-3" />
                              {item.type === "video"
                                ? "영상"
                                : item.type === "checklist"
                                  ? "체크리스트"
                                  : "읽기"}
                            </span>
                            <span className="flex items-center gap-1 text-[10px] text-gray-400">
                              <Clock className="w-3 h-3" />
                              {item.duration}
                            </span>
                            <span
                              className={`px-1.5 py-0.5 rounded text-[9px] font-semibold ${PRIORITY_COLORS[item.priority]}`}
                            >
                              {PRIORITY_LABELS[item.priority]}
                            </span>
                            {item.surgeryTypes?.includes(patient.surgery.type) && (
                              <span className="px-1.5 py-0.5 rounded text-[9px] font-semibold bg-indigo-50 text-indigo-700">
                                수술 맞춤
                              </span>
                            )}
                          </div>

                          <div className="flex items-center gap-2 mt-2">
                            {item.url && (
                              <a
                                href={item.url}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-1 text-[10px] font-semibold text-navy-500 bg-navy-50 hover:bg-navy-100 border border-navy-100 rounded-md px-2 py-1 transition-colors"
                              >
                                자료 열기
                                <ExternalLink className="w-3 h-3" />
                              </a>
                            )}
                            <Link
                              href={`/patient/${patient.id}/chat?q=${encodeURIComponent(`${item.title} 자료를 읽었는데, ${patient.surgery.nameKo} 환자 기준으로 핵심만 다시 설명해줘.`)}`}
                              className="inline-flex items-center gap-1 text-[10px] font-semibold text-teal-700 bg-teal-50 hover:bg-teal-100 border border-teal-100 rounded-md px-2 py-1 transition-colors"
                            >
                              질문하기
                              <MessageCircle className="w-3 h-3" />
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}

                {items.length === 0 && (
                  <p className="text-xs text-gray-400 text-center py-4">
                    이 단계의 교육 자료가 준비 중입니다.
                  </p>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
