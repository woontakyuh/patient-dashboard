import type { EducationItem, JourneyStageId, SurgeryType } from "@/lib/types";

export const EDUCATION_CONTENT: EducationItem[] = [
  // ── 수술 결정 (decision) ──
  {
    id: "edu-d1",
    title: "내시경 척추 수술이란?",
    type: "article",
    duration: "5분 읽기",
    stage: "decision",
    priority: "essential",
    summary:
      "UBE(양방향 내시경 수술)의 원리와 기존 수술과의 차이점, 장점을 알기 쉽게 설명합니다.",
    url: "https://takmd.com/education/endoscopic-spine-intro",
    surgeryTypes: ["ube_lumbar", "ube_cervical"],
  },
  {
    id: "edu-d2",
    title: "수술 전 검사 안내",
    type: "checklist",
    duration: "3분",
    stage: "decision",
    priority: "essential",
    summary:
      "혈액검사, 심전도, 흉부 X-ray 등 수술 전 필요한 검사 목록과 주의사항입니다.",
    url: "https://takmd.com/education/preop-checklist",
  },
  {
    id: "edu-d3",
    title: "ERAS 프로토콜 — 빠른 회복의 비결",
    type: "article",
    duration: "4분 읽기",
    stage: "decision",
    priority: "recommended",
    summary:
      "ERAS(수술 후 빠른 회복) 프로토콜의 핵심: 금식 최소화, 조기 보행, 통증 관리 방법을 안내합니다.",
    url: "https://takmd.com/education/eras-protocol",
  },
  {
    id: "edu-d4",
    title: "수술 동의서 이해하기",
    type: "article",
    duration: "5분 읽기",
    stage: "decision",
    priority: "recommended",
    summary:
      "수술 동의서에 포함된 주요 항목과 합병증 설명을 이해하기 쉽게 풀어드립니다.",
  },

  // ── 수술 당일 (surgery) ──
  {
    id: "edu-s1",
    title: "수술 당일 준비 가이드",
    type: "checklist",
    duration: "3분",
    stage: "surgery",
    priority: "essential",
    summary:
      "수술 당일 금식, 약물 복용, 수술실 이동 등 순서대로 안내합니다.",
    url: "https://takmd.com/education/opday-guide",
  },
  {
    id: "edu-s2",
    title: "마취와 수술 과정",
    type: "article",
    duration: "4분 읽기",
    stage: "surgery",
    priority: "recommended",
    summary:
      "전신마취 과정과 수술 중 진행 상황을 보호자분께 설명드립니다.",
  },

  // ── 초기 회복 (immediate) ──
  {
    id: "edu-i1",
    title: "수술 직후 통증 관리",
    type: "article",
    duration: "4분 읽기",
    stage: "immediate",
    priority: "essential",
    summary:
      "아세트아미노펜 + NSAIDs 기반 통증 관리법. 마약성 진통제 없이도 통증을 조절할 수 있습니다.",
  },
  {
    id: "edu-i2",
    title: "조기 보행의 중요성",
    type: "article",
    duration: "3분 읽기",
    stage: "immediate",
    priority: "essential",
    summary:
      "수술 당일부터 걷기 시작하는 이유와 올바른 보행 방법을 안내합니다.",
  },
  {
    id: "edu-i3",
    title: "이런 증상이 나타나면? (Red Flag)",
    type: "article",
    duration: "3분 읽기",
    stage: "immediate",
    priority: "essential",
    redFlag: true,
    summary:
      "발열, 심한 두통, 다리 마비 등 즉시 의료진에게 알려야 하는 위험 신호를 정리했습니다.",
    url: "https://takmd.com/education/red-flag",
  },
  {
    id: "edu-i4",
    title: "퇴원 준비 체크리스트",
    type: "checklist",
    duration: "3분",
    stage: "immediate",
    priority: "recommended",
    summary:
      "퇴원 전 확인해야 할 사항: 약물, 다음 외래일, 운동 안내 등을 정리합니다.",
  },

  // ── 초기 외래 (early_recovery) ──
  {
    id: "edu-e1",
    title: "퇴원 후 일상 복귀 가이드",
    type: "article",
    duration: "5분 읽기",
    stage: "early_recovery",
    priority: "essential",
    summary:
      "샤워, 운전, 출근, 가사 등 일상 활동별 복귀 시기와 주의사항입니다.",
    url: "https://takmd.com/education/daily-life-return",
  },
  {
    id: "edu-e2",
    title: "상처 관리와 감염 예방",
    type: "article",
    duration: "3분 읽기",
    stage: "early_recovery",
    priority: "essential",
    summary:
      "수술 부위 드레싱 교체, 샤워 방법, 감염 징후 확인법을 안내합니다.",
  },
  {
    id: "edu-e3",
    title: "첫 외래 방문 준비",
    type: "checklist",
    duration: "2분",
    stage: "early_recovery",
    priority: "recommended",
    summary:
      "수술 후 첫 외래 방문 시 가져올 것, 물어볼 질문 목록을 정리했습니다.",
  },

  // ── 중기 회복 (mid_recovery) ──
  {
    id: "edu-m1",
    title: "재활 운동 프로그램",
    type: "article",
    duration: "6분 읽기",
    stage: "mid_recovery",
    priority: "essential",
    summary:
      "수술 후 1~3개월 시기에 적합한 코어 강화, 스트레칭 운동을 단계별로 안내합니다.",
    url: "https://takmd.com/education/rehab-program",
  },
  {
    id: "edu-m2",
    title: "직장 복귀와 활동 가이드",
    type: "article",
    duration: "4분 읽기",
    stage: "mid_recovery",
    priority: "recommended",
    summary:
      "사무직/육체노동별 복귀 시기, 자세 교정, 업무 중 주의사항을 안내합니다.",
  },
  {
    id: "edu-m3",
    title: "재수술이 필요한 경우 (Red Flag)",
    type: "article",
    duration: "3분 읽기",
    stage: "mid_recovery",
    priority: "essential",
    redFlag: true,
    summary:
      "통증 악화, 새로운 신경 증상 등 재수술을 고려해야 하는 상황을 설명합니다.",
  },

  // ── 완전 회복 (full_recovery) ──
  {
    id: "edu-f1",
    title: "장기 관리와 재발 예방",
    type: "article",
    duration: "5분 읽기",
    stage: "full_recovery",
    priority: "essential",
    summary:
      "수술 후 1년 이후 생활 습관, 운동, 정기 검진 계획을 안내합니다.",
    url: "https://takmd.com/education/long-term-care",
  },
  {
    id: "edu-f2",
    title: "운동 제한 해제 가이드",
    type: "article",
    duration: "4분 읽기",
    stage: "full_recovery",
    priority: "recommended",
    summary:
      "수영, 골프, 등산 등 스포츠별 복귀 시기와 주의사항을 정리했습니다.",
    url: "https://takmd.com/education/sports-return",
  },

  // ── Surgery-Specific Bundles ──
  {
    id: "edu-spec-ube-lumbar",
    title: "UBE 요추 감압술 환자용 운동 가이드",
    type: "video",
    duration: "7분",
    stage: "early_recovery",
    priority: "essential",
    summary: "ULBD/discectomy/foraminal decomp 수술 환자를 위한 초기 보행과 허리 사용법 영상입니다.",
    url: "https://takmd.com/education/ube-lumbar-walking",
    surgeryTypes: ["ube_lumbar"],
  },
  {
    id: "edu-spec-fusion",
    title: "요추 유합술 보조기(TLSO) 착용법",
    type: "video",
    duration: "6분",
    stage: "immediate",
    priority: "essential",
    summary: "TLIF/OLIF/DLIF/PLIF/PPF/PSF 환자를 위한 보조기 착용/해제/생활 동작 안내입니다.",
    url: "https://takmd.com/education/fusion-brace",
    surgeryTypes: ["fusion"],
  },
  {
    id: "edu-spec-vp",
    title: "VP/FIMS V 후 낙상 예방 체크리스트",
    type: "checklist",
    duration: "3분",
    stage: "early_recovery",
    priority: "essential",
    summary: "시술 후 재골절 예방을 위한 집안 환경 점검 항목과 보호자 가이드를 제공합니다.",
    url: "https://takmd.com/education/vp-fall-prevention",
    surgeryTypes: ["vp"],
  },
  {
    id: "edu-spec-ube-cervical",
    title: "UBE 경추 수술 후 목/팔 증상 체크",
    type: "article",
    duration: "4분 읽기",
    stage: "early_recovery",
    priority: "essential",
    summary: "PCF/C-ULBD 환자에서 흔한 회복 증상과 즉시 보고가 필요한 신경학적 변화를 정리했습니다.",
    url: "https://takmd.com/education/ube-cervical-check",
    surgeryTypes: ["ube_cervical"],
  },
  {
    id: "edu-spec-lp",
    title: "Cervical LP 보행 균형 훈련",
    type: "video",
    duration: "5분",
    stage: "mid_recovery",
    priority: "recommended",
    summary: "Laminoplasty 후 보행 안정성 회복을 위한 단계별 균형 훈련 가이드입니다.",
    url: "https://takmd.com/education/lp-balance",
    surgeryTypes: ["lp"],
  },
  {
    id: "edu-spec-acdf",
    title: "ACDF 연하장애/쉰목소리 관리",
    type: "article",
    duration: "4분 읽기",
    stage: "immediate",
    priority: "essential",
    summary: "ACDF 직후 흔한 연하 증상과 회복 경과, 외래 전 확인할 체크포인트를 안내합니다.",
    url: "https://takmd.com/education/acdf-swallowing",
    surgeryTypes: ["acdf"],
  },
];

export function getEducationByStage(
  stage: JourneyStageId,
  surgeryType?: SurgeryType
): EducationItem[] {
  return EDUCATION_CONTENT.filter((item) => {
    if (item.stage !== stage) return false;
    if (!surgeryType || !item.surgeryTypes || item.surgeryTypes.length === 0) return true;
    return item.surgeryTypes.includes(surgeryType);
  });
}
