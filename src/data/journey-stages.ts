import type { JourneyStage, JourneyStageId } from "@/lib/types";

// ── Journey Stage 정의 ─────────────────────────────────────────

export const JOURNEY_STAGES: JourneyStage[] = [
  {
    id: "decision",
    title: "Surgery Decision",
    titleKo: "수술 결정",
    subtitle: "수술 전 준비 단계",
    description: "수술이 결정되었습니다. 입원 전 준비사항을 확인하고, 수술에 대한 교육 자료를 읽어보세요.",
    icon: "ClipboardCheck",
    dayRange: { from: -7, to: -1 },
    tasks: [
      "수술 동의서 확인",
      "수술 전 검사 완료 (혈액, 심전도, X-ray)",
      "ERAS 금식 안내 확인",
      "수술 전 교육 영상 시청",
      "보호자 연락처 등록",
    ],
    clinicalStageIds: ["pre-op"],
  },
  {
    id: "surgery",
    title: "Surgery Day",
    titleKo: "수술 당일",
    subtitle: "수술 진행",
    description: "오늘은 수술일입니다. 의료진이 최선을 다해 수술을 진행합니다.",
    icon: "Stethoscope",
    dayRange: { from: 0, to: 0 },
    tasks: [
      "수술 전 금식 확인",
      "수술실 이동",
      "수술 후 회복실 안정",
      "병동 복귀 후 조기 보행 시작",
    ],
    clinicalStageIds: ["surgery-day"],
  },
  {
    id: "immediate",
    title: "Immediate Recovery",
    titleKo: "초기 회복",
    subtitle: "수술 후 입원 기간",
    description: "수술 직후 회복 기간입니다. 통증 관리, 조기 보행, 식이 진행에 집중합니다.",
    icon: "Bed",
    dayRange: { from: 1, to: 7 },
    tasks: [
      "통증 자가평가 (VAS) 기록",
      "보행 거리 점진적 확대",
      "일반식 식이 진행",
      "배액관/도뇨관 제거 확인",
      "퇴원 교육 이수",
    ],
    clinicalStageIds: ["pod1", "pod2-3", "pod3-4", "discharge"],
  },
  {
    id: "early_recovery",
    title: "Early Recovery",
    titleKo: "초기 외래",
    subtitle: "퇴원 후 2주",
    description: "퇴원 후 첫 외래 방문까지의 기간입니다. 일상 복귀를 서서히 시작합니다.",
    icon: "Footprints",
    dayRange: { from: 8, to: 30 },
    tasks: [
      "첫 외래 방문 (수술 후 2주)",
      "상처 드레싱 상태 확인",
      "PROM 설문 작성 (VAS, ODI/NDI)",
      "가벼운 산책 시작",
      "운전/출근 시기 의료진 확인",
    ],
    clinicalStageIds: ["fu-2w"],
  },
  {
    id: "mid_recovery",
    title: "Mid Recovery",
    titleKo: "중기 회복",
    subtitle: "1~3개월",
    description: "수술 부위가 안정화되는 시기입니다. 활동 범위를 서서히 넓혀갑니다.",
    icon: "TrendingUp",
    dayRange: { from: 31, to: 180 },
    tasks: [
      "외래 방문 (6주, 3개월)",
      "PROM 설문 정기 작성",
      "재활 운동 프로그램 시작",
      "무거운 물건 들기 제한 확인",
      "직장 복귀 계획 수립",
    ],
    clinicalStageIds: ["fu-6w", "fu-3m"],
  },
  {
    id: "full_recovery",
    title: "Full Recovery",
    titleKo: "완전 회복",
    subtitle: "6개월~1년",
    description: "장기 추적 단계입니다. 대부분의 활동이 가능하며, 정기 검진으로 경과를 확인합니다.",
    icon: "Award",
    dayRange: { from: 181, to: 365 },
    tasks: [
      "외래 방문 (6개월, 1년)",
      "최종 PROM 설문 작성",
      "운동 제한 해제 확인",
      "일상 활동 완전 복귀",
    ],
    clinicalStageIds: ["fu-6m", "fu-1y"],
  },
];

// ── 현재 Journey Stage 계산 ─────────────────────────────────────

export function computeJourneyStage(surgeryDate: string): JourneyStageId {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const surgery = new Date(surgeryDate);
  surgery.setHours(0, 0, 0, 0);
  const diffDays = Math.round(
    (today.getTime() - surgery.getTime()) / (1000 * 60 * 60 * 24)
  );

  // diffDays = 양수면 수술 후, 음수면 수술 전
  for (const stage of JOURNEY_STAGES) {
    if (diffDays >= stage.dayRange.from && diffDays <= stage.dayRange.to) {
      return stage.id;
    }
  }

  // 범위 밖: 수술 7일 이전 → decision, 1년 이후 → full_recovery
  if (diffDays < JOURNEY_STAGES[0].dayRange.from) return "decision";
  return "full_recovery";
}

export function getJourneyStage(id: JourneyStageId): JourneyStage {
  return JOURNEY_STAGES.find((s) => s.id === id)!;
}

export function getJourneyProgress(surgeryDate: string): number {
  const currentId = computeJourneyStage(surgeryDate);
  const idx = JOURNEY_STAGES.findIndex((s) => s.id === currentId);
  // 0% at start of decision, 100% at end of full_recovery
  return Math.round(((idx + 0.5) / JOURNEY_STAGES.length) * 100);
}

export function getJourneyStageStatus(
  stageId: JourneyStageId,
  currentId: JourneyStageId
): "completed" | "current" | "upcoming" {
  const stageIdx = JOURNEY_STAGES.findIndex((s) => s.id === stageId);
  const currentIdx = JOURNEY_STAGES.findIndex((s) => s.id === currentId);
  if (stageIdx < currentIdx) return "completed";
  if (stageIdx === currentIdx) return "current";
  return "upcoming";
}
