import type { JourneyStageId, TriageLevel } from "@/lib/types";

// ── FAQ 데이터 ──────────────────────────────────────────────────

interface FaqEntry {
  id: string;
  keywords: string[];
  question: string;
  answer: string;
  triage: TriageLevel;
  stages?: JourneyStageId[]; // 해당 단계에서만 표시 (없으면 전체)
}

export const FAQ_DATABASE: FaqEntry[] = [
  // ── Green (일반 안내) ──
  {
    id: "faq-g1",
    keywords: ["샤워", "씻기", "목욕", "세수"],
    question: "샤워는 언제부터 할 수 있나요?",
    answer:
      "수술 후 2-3일부터 간단한 샤워가 가능합니다. 수술 부위에 직접 물이 닿지 않도록 방수 테이프를 붙이고, 탕이나 사우나는 수술 후 4주까지 피해주세요.",
    triage: "green",
  },
  {
    id: "faq-g2",
    keywords: ["운전", "차", "드라이브"],
    question: "운전은 언제부터 가능한가요?",
    answer:
      "수술 후 2주 외래 방문 시 의료진과 상의해주세요. 통상적으로 수술 후 2-4주 후부터 짧은 거리 운전이 가능합니다. 장거리 운전은 6주 이후를 권장합니다.",
    triage: "green",
  },
  {
    id: "faq-g3",
    keywords: ["출근", "회사", "직장", "복귀", "업무"],
    question: "직장 복귀는 언제 가능한가요?",
    answer:
      "사무직의 경우 보통 수술 후 2-4주, 육체노동이 많은 직종은 6-12주 후 복귀가 가능합니다. 무거운 물건 들기는 6주 이후부터 점진적으로 가능합니다.",
    triage: "green",
  },
  {
    id: "faq-g4",
    keywords: ["운동", "헬스", "수영", "골프", "등산", "조깅"],
    question: "운동은 언제부터 할 수 있나요?",
    answer:
      "가벼운 산책은 퇴원 직후부터 가능합니다. 수영은 4주 후, 골프는 6주 후, 등산이나 조깅은 8-12주 후부터 점진적으로 시작하세요. 무거운 웨이트 트레이닝은 3개월 이후를 권장합니다.",
    triage: "green",
  },
  {
    id: "faq-g5",
    keywords: ["통증", "아파", "진통제", "약", "타이레놀"],
    question: "퇴원 후 통증이 있으면 어떻게 하나요?",
    answer:
      "처방받은 아세트아미노펜(타이레놀)을 하루 3회 규칙적으로 복용하세요. 추가 통증 시 처방받은 NSAIDs를 함께 복용할 수 있습니다. 마약성 진통제는 사용하지 않습니다.",
    triage: "green",
  },
  {
    id: "faq-g6",
    keywords: ["식사", "음식", "밥", "먹기", "식이"],
    question: "식사에 제한이 있나요?",
    answer:
      "수술 후 특별한 식이 제한은 없습니다. 균형 잡힌 식사를 하시되, 뼈 건강을 위해 칼슘과 비타민D가 풍부한 음식을 챙기시는 것이 좋습니다.",
    triage: "green",
  },
  {
    id: "faq-g7",
    keywords: ["잠", "자세", "수면", "베개", "눕기"],
    question: "수면 자세는 어떻게 해야 하나요?",
    answer:
      "똑바로 누워 무릎 아래에 베개를 받치는 것이 가장 편합니다. 옆으로 누울 때는 양 무릎 사이에 베개를 끼우세요. 엎드려 자는 것은 4주간 피해주세요.",
    triage: "green",
  },
  {
    id: "faq-g8",
    keywords: ["보조기", "허리띠", "벨트", "코르셋"],
    question: "보조기는 얼마나 착용해야 하나요?",
    answer:
      "수술 유형에 따라 다릅니다. UBE의 경우 2-4주, 유합술의 경우 2-3개월 착용을 권장합니다. 취침 시에는 벗어도 됩니다. 외래 방문 시 의료진과 제거 시기를 상의하세요.",
    triage: "green",
  },
  {
    id: "faq-g9",
    keywords: ["술", "음주", "알코올", "맥주", "소주"],
    question: "음주는 언제부터 가능한가요?",
    answer:
      "수술 후 최소 4주간은 음주를 피해주세요. 진통제 복용 중에는 절대 음주하시면 안 됩니다. 이후에도 과음은 뼈 회복에 좋지 않으므로 적당량만 드세요.",
    triage: "green",
  },
  {
    id: "faq-g10",
    keywords: ["비행기", "여행", "해외"],
    question: "비행기를 타도 되나요?",
    answer:
      "수술 후 2주 이내 장거리 비행은 피하세요. 2주 이후 짧은 비행(2-3시간)은 가능합니다. 장거리 비행은 4주 이후를 권장하며, 30분마다 일어나 스트레칭하세요.",
    triage: "green",
  },

  // ── Yellow (의사 확인 필요) ──
  {
    id: "faq-y1",
    keywords: ["열", "발열", "체온", "38"],
    question: "수술 부위에 열감이 느껴져요",
    answer:
      "수술 후 2-3일간 미열(37.5도 이하)은 정상적인 반응입니다. 하지만 38도 이상의 발열이 지속되거나 수술 부위가 붉어지고 부어오르면 감염 가능성이 있으니 의료진에게 연락해주세요.",
    triage: "yellow",
  },
  {
    id: "faq-y2",
    keywords: ["저림", "찌릿", "감각", "무감각", "찌릿찌릿"],
    question: "다리/팔이 저리고 감각이 이상해요",
    answer:
      "수술 직후 일시적인 저림은 신경 회복 과정에서 나타날 수 있습니다. 하지만 새로 생긴 저림이나 점점 심해지는 감각 이상은 신경 문제 신호일 수 있으니, 의료진과 상의가 필요합니다.",
    triage: "yellow",
  },
  {
    id: "faq-y3",
    keywords: ["소변", "대변", "배뇨", "배변", "방광"],
    question: "소변/대변이 잘 안 나와요",
    answer:
      "수술 후 일시적인 배뇨/배변 곤란은 마취의 영향으로 나타날 수 있습니다. 하지만 24시간 이상 소변을 보지 못하거나, 하반신 감각 이상과 함께 나타나면 마미증후군의 징후일 수 있으니 즉시 의료진에게 알려주세요.",
    triage: "yellow",
  },
  {
    id: "faq-y4",
    keywords: ["출혈", "피", "진물", "상처"],
    question: "수술 부위에서 분비물이 나와요",
    answer:
      "수술 후 1-2일간 소량의 붉은 분비물은 정상입니다. 하지만 다량의 출혈이나 노란색/녹색 분비물, 악취가 나는 경우는 감염 징후이므로 의료진에게 연락해주세요.",
    triage: "yellow",
  },
  {
    id: "faq-y5",
    keywords: ["부었", "부어", "붓기", "부종"],
    question: "수술 부위가 많이 부어 있어요",
    answer:
      "수술 후 2-3일간 약간의 부기는 정상입니다. 하지만 부기가 점점 심해지거나 열감/발적이 동반되면 의료진과 상의가 필요합니다.",
    triage: "yellow",
  },

  // ── Red (즉시 응급) ──
  {
    id: "faq-r1",
    keywords: ["마비", "못움직", "움직이지", "힘이 없", "못걸"],
    question: "다리/팔에 힘이 없어요 (마비 증상)",
    answer:
      "⚠️ 새로 발생한 근력 저하/마비는 응급 상황입니다. 신경 손상 또는 혈종 압박의 징후일 수 있습니다. 즉시 응급실에 내원하시거나 119에 연락해주세요.",
    triage: "red",
  },
  {
    id: "faq-r2",
    keywords: ["두통", "머리", "구토", "뇌"],
    question: "극심한 두통과 구토가 있어요",
    answer:
      "⚠️ 수술 후 극심한 두통(특히 앉거나 서면 악화)은 경막 손상에 의한 뇌척수액 누출 가능성이 있습니다. 구토가 동반되면 즉시 응급실에 내원하세요.",
    triage: "red",
  },
  {
    id: "faq-r3",
    keywords: ["흉통", "가슴", "숨", "호흡곤란", "숨쉬기"],
    question: "가슴이 아프고 숨쉬기 어려워요",
    answer:
      "⚠️ 수술 후 갑작스러운 흉통/호흡곤란은 폐색전증의 위험 신호입니다. 이는 생명을 위협하는 응급 상황이므로 즉시 119에 연락하세요.",
    triage: "red",
  },
  {
    id: "faq-r4",
    keywords: ["종아리", "다리 부어", "한쪽 다리"],
    question: "한쪽 종아리가 심하게 부어올랐어요",
    answer:
      "⚠️ 한쪽 종아리의 갑작스러운 부종과 통증은 심부정맥 혈전증(DVT)의 징후일 수 있습니다. 이는 폐색전증으로 진행할 수 있으므로 즉시 응급실에 내원하세요.",
    triage: "red",
  },
];

// ── Red Flag 키워드 감지 ──────────────────────────────────────

const RED_FLAG_KEYWORDS = [
  "마비",
  "못움직",
  "움직이지",
  "힘이 없",
  "못걸",
  "두통",
  "구토",
  "흉통",
  "가슴 아",
  "숨쉬기",
  "호흡곤란",
  "종아리 부",
  "한쪽 다리 부",
  "소변 못",
  "대변 못",
  "고열",
  "39도",
  "40도",
  "의식",
  "쓰러",
  "실신",
];

export function detectRedFlag(message: string): boolean {
  const lower = message.toLowerCase();
  return RED_FLAG_KEYWORDS.some((kw) => lower.includes(kw));
}

// ── FAQ 매칭 ──────────────────────────────────────────────────

export function matchFaq(
  message: string,
  currentStage?: JourneyStageId
): FaqEntry | null {
  const lower = message.toLowerCase();

  // Red flags 우선
  const redMatch = FAQ_DATABASE.filter(
    (faq) =>
      faq.triage === "red" && faq.keywords.some((kw) => lower.includes(kw))
  );
  if (redMatch.length > 0) return redMatch[0];

  // Yellow
  const yellowMatch = FAQ_DATABASE.filter(
    (faq) =>
      faq.triage === "yellow" && faq.keywords.some((kw) => lower.includes(kw))
  );
  if (yellowMatch.length > 0) return yellowMatch[0];

  // Green (단계별 필터링)
  const greenMatch = FAQ_DATABASE.filter(
    (faq) =>
      faq.triage === "green" &&
      faq.keywords.some((kw) => lower.includes(kw)) &&
      (!faq.stages || !currentStage || faq.stages.includes(currentStage))
  );
  if (greenMatch.length > 0) return greenMatch[0];

  return null;
}

// ── 빠른 질문 버튼 (단계별) ──────────────────────────────────

export function getQuickQuestions(
  stage: JourneyStageId
): { label: string; message: string }[] {
  switch (stage) {
    case "decision":
      return [
        { label: "수술 과정", message: "수술은 어떤 과정으로 진행되나요?" },
        { label: "금식 안내", message: "수술 전 금식은 어떻게 하나요?" },
        { label: "준비물", message: "입원 시 준비물이 뭐가 필요한가요?" },
      ];
    case "surgery":
      return [
        { label: "마취", message: "마취는 어떻게 진행되나요?" },
        { label: "수술 시간", message: "수술 시간이 얼마나 걸리나요?" },
        { label: "보호자 대기", message: "보호자는 어디서 대기하나요?" },
      ];
    case "immediate":
      return [
        { label: "통증 관리", message: "통증이 심한데 어떻게 하나요?" },
        { label: "보행", message: "언제부터 걸을 수 있나요?" },
        { label: "퇴원", message: "퇴원은 언제 가능한가요?" },
      ];
    case "early_recovery":
      return [
        { label: "샤워", message: "샤워는 언제부터 할 수 있나요?" },
        { label: "운전", message: "운전은 언제부터 가능한가요?" },
        { label: "상처 관리", message: "상처 부위를 어떻게 관리하나요?" },
      ];
    case "mid_recovery":
      return [
        { label: "운동", message: "운동은 언제부터 할 수 있나요?" },
        { label: "출근", message: "직장 복귀는 언제 가능한가요?" },
        { label: "보조기", message: "보조기는 얼마나 착용해야 하나요?" },
      ];
    case "full_recovery":
      return [
        { label: "재발 예방", message: "재발을 예방하려면 어떻게 해야 하나요?" },
        { label: "스포츠", message: "운동은 언제부터 할 수 있나요?" },
        { label: "정기 검진", message: "정기 검진은 얼마나 자주 받아야 하나요?" },
      ];
  }
}
