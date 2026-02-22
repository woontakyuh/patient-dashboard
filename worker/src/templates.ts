import type { FaqItem } from "./types";

interface TemplateStage {
  id: string;
  title: string;
  dateOffset: number | null; // days relative to Op Date
  phase: "inpatient" | "outpatient";
  instructions: string[];
  warnings: string[];
  dos: string[];
  donts: string[];
  faq?: FaqItem[];
}

// ── Surgery type detection ──

type SurgeryType = "ube" | "acdf" | "lp" | "fusion" | "generic";

function detectSurgeryType(categories: string[], opName: string): SurgeryType {
  const cats = categories.map((c) => c.toLowerCase());
  const name = opName.toLowerCase();

  if (cats.includes("ube") || cats.includes("ulbd") || name.includes("ube")) return "ube";
  if (cats.includes("acdf") || name.includes("acdf")) return "acdf";
  if (cats.includes("lp") || name.includes("laminoplasty") || name.includes("laminectomy") || name.includes("lp")) return "lp";
  if (cats.includes("fusion") || name.includes("plif") || name.includes("tlif") || name.includes("fusion")) return "fusion";
  return "generic";
}

export function getSurgeryAbbreviation(categories: string[], opName: string): string {
  const type = detectSurgeryType(categories, opName);
  switch (type) {
    case "ube": return "UBE";
    case "acdf": return "ACDF";
    case "lp": return "LP";
    case "fusion": return "Fusion";
    default: return categories[0] || "OP";
  }
}

export function getSurgeryNameKo(categories: string[], opName: string): string {
  const type = detectSurgeryType(categories, opName);
  switch (type) {
    case "ube": return "양방향 내시경 디스크 제거술";
    case "acdf": return "전방 경추 추간판 제거 및 유합술";
    case "lp": return "추궁 성형술 / 절제술";
    case "fusion": return "척추 유합술";
    default: return opName;
  }
}

export function getPromInstruments(categories: string[]): string[] {
  const type = detectSurgeryType(categories, "");
  if (type === "acdf" || type === "lp") {
    return ["VAS", "NDI", "JOA", "EQ5D", "EQVAS"];
  }
  return ["VAS", "ODI", "JOA", "EQ5D", "EQVAS"];
}

// ── Stage templates ──

export function getTemplate(categories: string[]): Omit<TemplateStage, "date" | "status">[] {
  const type = detectSurgeryType(categories, "");
  switch (type) {
    case "ube": return ubeTemplate;
    case "acdf": return acdfTemplate;
    default: return genericTemplate;
  }
}

// ── UBE/ULBD Template ──

const ubeTemplate: Omit<TemplateStage, "date" | "status">[] = [
  {
    id: "pre-op",
    title: "수술 전 준비 (입원 당일)",
    dateOffset: -1,
    phase: "inpatient",
    instructions: [
      "입원 수속 및 병실 배정",
      "수술 전 혈액검사, 소변검사, 심전도, 흉부 X-ray 시행",
      "마취과 상담 및 동의서 작성",
      "수술 부위 피부 준비",
      "자정부터 금식 (물 포함)",
    ],
    warnings: [
      "항응고제/항혈소판제 복용 시 반드시 의료진에게 알릴 것",
      "알레르기 이력 반드시 고지",
    ],
    dos: ["수술 동의서 꼼꼼히 읽고 서명하기", "보호자 연락처 확인하기", "개인 귀중품은 보호자에게 맡기기"],
    donts: ["자정 이후 음식 및 물 섭취 금지", "흡연 금지", "임의로 약 복용하지 않기"],
  },
  {
    id: "surgery-day",
    title: "수술 당일",
    dateOffset: 0,
    phase: "inpatient",
    instructions: [
      "수술 가운으로 환복",
      "정맥 주사(IV) 확보",
      "수술실 이동 및 양방향 내시경 디스크 제거술 시행 (약 1시간)",
      "회복실에서 마취 회복 후 병실 복귀",
      "수술 후 하지 감각 및 운동 기능 확인",
    ],
    warnings: [
      "수술 후 하지 감각 저하 또는 마비 발생 시 즉시 알릴 것",
      "심한 두통, 오심, 구토 시 의료진 호출",
    ],
    dos: ["의료진 지시에 따라 안정 취하기", "통증 참지 말고 알리기", "지시된 체위 유지하기"],
    donts: ["무리하게 움직이지 않기", "허리 비틀기 동작 금지", "수술 부위 만지지 않기"],
  },
  {
    id: "pod1",
    title: "수술 후 1일차 (POD#1)",
    dateOffset: 1,
    phase: "inpatient",
    instructions: [
      "보조기 착용 하에 침상 옆 기립 시도",
      "보행기 이용 단거리 보행 시작",
      "식이 진행 (유동식 → 일반식)",
      "배액관 제거 (의사 판단 하)",
      "수술 부위 드레싱 상태 확인",
    ],
    warnings: [
      "보행 시 어지럼증이나 하지 위약감 발생 시 즉시 중단",
      "발열(38°C 이상) 시 의료진 보고",
      "소변 보기 어려울 경우 알릴 것",
    ],
    dos: ["조기 보행 시도하기 (짧은 거리부터)", "심호흡 운동 자주 하기", "충분한 수분 섭취", "통증 수준 의료진에게 정확히 전달하기"],
    donts: ["보조기 없이 걷지 않기", "허리 숙이기/비틀기 금지", "무거운 물건 들지 않기", "장시간 같은 자세 유지하지 않기"],
  },
  {
    id: "discharge",
    title: "퇴원 및 퇴원교육",
    dateOffset: 1,
    phase: "inpatient",
    instructions: [
      "퇴원 약 수령 (진통제, 근이완제, 위장약)",
      "외래 예약 확인 (2주 후)",
      "퇴원 후 자가 관리 교육",
      "상처 관리법 교육 (방수 드레싱, 소독법)",
      "재활 운동 교육자료 수령",
    ],
    warnings: [
      "퇴원 후 38°C 이상 발열 시 응급 내원",
      "하지 마비 또는 대소변 장애 발생 시 즉시 응급실 방문",
      "수술 부위 발적, 부종, 농성 삼출물 시 즉시 내원",
    ],
    dos: ["처방 약물 정해진 시간에 복용하기", "보조기 착용하고 짧은 거리 산책하기", "상처 부위 건조하게 유지하기", "교육받은 재활 운동 매일 수행하기"],
    donts: ["3kg 이상 물건 들지 않기", "장시간 앉거나 운전하지 않기", "목욕탕, 사우나, 수영장 이용 금지", "허리에 무리가 가는 운동 금지"],
  },
  {
    id: "fu-2w",
    title: "수술 후 2주 외래",
    dateOffset: 14,
    phase: "outpatient",
    instructions: ["수술 부위 상처 확인 및 실밥 제거", "PROM 설문 작성 (VAS, ODI, EQ-5D)", "신경학적 검진", "필요 시 약물 조정"],
    warnings: ["상처 치유 지연 또는 감염 소견 시 추가 처치 필요", "통증이 수술 전보다 악화된 경우 반드시 보고"],
    dos: ["일상 생활 동작 점진적으로 늘리기", "걷기 운동 하루 20~30분", "처방 약물 꾸준히 복용하기"],
    donts: ["5kg 이상 물건 들기 금지", "장시간 연속 앉기 금지", "격렬한 운동 금지"],
    faq: [
      { question: "실밥 제거가 아프나요?", answer: "UBE 수술은 피부 절개가 작아 실밥 제거 시 불편감이 적습니다." },
      { question: "샤워는 언제부터 가능한가요?", answer: "실밥 제거 후 방수 드레싱을 유지하면 샤워가 가능합니다." },
      { question: "운전은 언제부터 할 수 있나요?", answer: "보통 2~4주 후부터 단거리 운전이 가능합니다." },
    ],
  },
  {
    id: "fu-6w",
    title: "수술 후 6주 외래",
    dateOffset: 42,
    phase: "outpatient",
    instructions: ["X-ray 촬영하여 경과 확인", "PROM 설문 작성", "재활 운동 진행 상황 평가", "보조기 착용 중단 여부 결정"],
    warnings: ["하지 방사통 재발 시 MRI 추가 검사 필요 가능"],
    dos: ["코어 근력 강화 운동 시작하기", "수영, 자전거 등 저강도 유산소 운동 시작", "바른 자세 습관 유지하기"],
    donts: ["무거운 역기 운동 금지", "허리 과신전/과굴곡 동작 금지"],
    faq: [
      { question: "보조기를 언제 벗을 수 있나요?", answer: "보통 수술 후 4~6주에 보조기 착용 중단을 결정합니다." },
      { question: "직장 복귀는 가능한가요?", answer: "사무직은 4~6주, 육체 노동은 8~12주 후 복귀가 일반적입니다." },
    ],
  },
  {
    id: "fu-3m",
    title: "수술 후 3개월 외래",
    dateOffset: 90,
    phase: "outpatient",
    instructions: ["MRI 촬영 (필요 시)", "PROM 설문 작성", "일상 복귀 수준 평가", "직장 복귀 가능 여부 상담"],
    warnings: ["증상 재발 시 재수술 가능성 상담 필요"],
    dos: ["정상 일상 활동으로 점진적 복귀", "규칙적인 운동 습관 만들기", "체중 관리"],
    donts: ["고강도 접촉 스포츠 아직 금지", "무리한 허리 사용 동작 자제"],
    faq: [
      { question: "디스크가 다시 나올 수 있나요?", answer: "동일 부위 재발률은 약 5~10%입니다. 코어 운동, 바른 자세, 체중 관리가 중요합니다." },
    ],
  },
  {
    id: "fu-6m",
    title: "수술 후 6개월 외래",
    dateOffset: 180,
    phase: "outpatient",
    instructions: ["PROM 설문 작성", "기능적 회복 평가", "운동 강도 상향 가능 여부 판단"],
    warnings: ["만성 통증 양상이 있으면 통증 클리닉 연계 고려"],
    dos: ["다양한 운동 활동 점진적으로 확대", "정기적인 코어 운동 유지"],
    donts: ["급격한 고강도 운동 전환 금지"],
    faq: [
      { question: "이제 모든 운동을 해도 되나요?", answer: "대부분 가능하지만, 고중량 허리 부하 운동은 주의가 필요합니다." },
    ],
  },
  {
    id: "fu-1y",
    title: "수술 후 1년 외래",
    dateOffset: 365,
    phase: "outpatient",
    instructions: ["최종 PROM 설문 작성", "MRI 촬영 (필요 시)", "최종 기능 평가 및 치료 종결 상담", "장기 관리 계획 수립"],
    warnings: ["인접 분절 퇴행 가능성에 대해 교육"],
    dos: ["평생 코어 근력 운동 유지", "바른 자세 습관 생활화", "적정 체중 유지"],
    donts: ["장기간 허리 건강 관리 소홀히 하지 않기"],
    faq: [
      { question: "앞으로 정기 검진이 필요한가요?", answer: "특별한 증상이 없으면 정기 추적은 필요 없지만, 새 증상 발생 시 바로 내원하세요." },
    ],
  },
];

// ── ACDF Template (경추) ──

const acdfTemplate: Omit<TemplateStage, "date" | "status">[] = [
  {
    id: "pre-op",
    title: "수술 전 준비 (입원 당일)",
    dateOffset: -1,
    phase: "inpatient",
    instructions: ["입원 수속 및 병실 배정", "수술 전 검사 시행", "마취과 상담 및 동의서 작성", "자정부터 금식"],
    warnings: ["항응고제 복용 시 반드시 의료진에게 알릴 것"],
    dos: ["수술 동의서 꼼꼼히 읽고 서명하기", "보호자 연락처 확인하기"],
    donts: ["자정 이후 음식 및 물 섭취 금지", "흡연 금지"],
  },
  {
    id: "surgery-day",
    title: "수술 당일",
    dateOffset: 0,
    phase: "inpatient",
    instructions: ["수술 가운으로 환복", "ACDF 수술 시행 (약 1.5~2시간)", "회복실에서 마취 회복", "경추 보조기 착용", "삼킴 기능 및 사지 운동 확인"],
    warnings: ["삼킴 곤란(연하 장애) 발생 시 즉시 보고", "사지 감각 저하 또는 마비 시 즉시 알릴 것", "호흡 곤란 시 즉시 의료진 호출"],
    dos: ["의료진 지시에 따라 안정 취하기", "경추 보조기 유지하기"],
    donts: ["목을 과도하게 움직이지 않기", "수술 부위 만지지 않기"],
  },
  {
    id: "pod1",
    title: "수술 후 1일차 (POD#1)",
    dateOffset: 1,
    phase: "inpatient",
    instructions: ["경추 보조기 착용 후 기립 시도", "연식 식사 시작", "삼킴 기능 재확인", "X-ray 촬영"],
    warnings: ["삼킴 곤란 지속 시 의료진 보고", "발열 시 의료진 보고"],
    dos: ["경추 보조기 착용 유지", "부드러운 음식부터 시작", "충분한 수분 섭취"],
    donts: ["경추 보조기 없이 활동하지 않기", "목 회전/과굴곡 금지", "무거운 물건 들지 않기"],
  },
  {
    id: "discharge",
    title: "퇴원 및 퇴원교육",
    dateOffset: 2,
    phase: "inpatient",
    instructions: ["퇴원 약 수령", "외래 예약 확인 (2주 후)", "경추 보조기 착용 교육", "상처 관리법 교육"],
    warnings: ["삼킴 곤란 악화 시 응급 내원", "사지 마비 발생 시 즉시 응급실 방문"],
    dos: ["경추 보조기 6~8주 착용", "부드러운 음식 섭취 유지", "처방 약물 복용"],
    donts: ["무거운 물건 들지 않기", "장시간 목을 숙이는 자세 금지", "목욕탕/사우나 금지"],
  },
  {
    id: "fu-2w",
    title: "수술 후 2주 외래",
    dateOffset: 14,
    phase: "outpatient",
    instructions: ["상처 확인 및 실밥 제거", "PROM 설문 작성 (VAS, NDI, EQ-5D)", "삼킴 기능 확인"],
    warnings: ["삼킴 곤란 지속 시 ENT 협진"],
    dos: ["일상 활동 점진적 확대", "경추 보조기 꾸준히 착용"],
    donts: ["경추 보조기 임의 제거 금지", "격렬한 운동 금지"],
  },
  {
    id: "fu-6w",
    title: "수술 후 6주 외래",
    dateOffset: 42,
    phase: "outpatient",
    instructions: ["X-ray 촬영 (유합 진행 확인)", "PROM 설문 작성", "경추 보조기 제거 여부 결정"],
    warnings: ["유합 지연 시 보조기 연장 착용"],
    dos: ["목 스트레칭 시작 (의사 허가 후)", "바른 자세 유지"],
    donts: ["접촉 스포츠 금지", "무거운 물건 들기 금지"],
  },
  {
    id: "fu-3m",
    title: "수술 후 3개월 외래",
    dateOffset: 90,
    phase: "outpatient",
    instructions: ["X-ray/CT 촬영 (유합 확인)", "PROM 설문 작성", "일상 복귀 평가"],
    warnings: ["유합 부전 시 추가 치료 필요"],
    dos: ["정상 활동 점진적 복귀", "목 근력 강화 운동"],
    donts: ["과도한 목 운동 자제"],
  },
  {
    id: "fu-6m",
    title: "수술 후 6개월 외래",
    dateOffset: 180,
    phase: "outpatient",
    instructions: ["PROM 설문 작성", "기능적 회복 평가"],
    warnings: ["인접 분절 퇴행 증상 모니터링"],
    dos: ["규칙적 운동", "바른 자세 유지"],
    donts: ["고강도 목 부하 운동 자제"],
  },
  {
    id: "fu-1y",
    title: "수술 후 1년 외래",
    dateOffset: 365,
    phase: "outpatient",
    instructions: ["최종 PROM 설문 작성", "X-ray 촬영", "최종 평가 및 치료 종결"],
    warnings: ["인접 분절 퇴행 가능성 교육"],
    dos: ["평생 바른 자세 유지", "규칙적 운동"],
    donts: ["장기간 목 건강 관리 소홀히 하지 않기"],
  },
];

// ── Generic Template (fallback) ──

const genericTemplate: Omit<TemplateStage, "date" | "status">[] = [
  {
    id: "pre-op",
    title: "수술 전 준비",
    dateOffset: -1,
    phase: "inpatient",
    instructions: ["입원 수속", "수술 전 검사", "마취과 상담", "자정부터 금식"],
    warnings: ["약물 복용 이력 반드시 고지"],
    dos: ["동의서 서명", "보호자 연락처 확인"],
    donts: ["금식 시간 이후 음식 섭취 금지"],
  },
  {
    id: "surgery-day",
    title: "수술 당일",
    dateOffset: 0,
    phase: "inpatient",
    instructions: ["수술 시행", "회복실 관찰", "병실 복귀"],
    warnings: ["이상 증상 발생 시 즉시 의료진 호출"],
    dos: ["안정 취하기", "통증 알리기"],
    donts: ["무리하게 움직이지 않기"],
  },
  {
    id: "pod1",
    title: "수술 후 1일차",
    dateOffset: 1,
    phase: "inpatient",
    instructions: ["기립 시도", "식이 진행", "드레싱 확인"],
    warnings: ["발열 시 의료진 보고"],
    dos: ["조기 보행 시도", "충분한 수분 섭취"],
    donts: ["무거운 물건 들지 않기"],
  },
  {
    id: "discharge",
    title: "퇴원",
    dateOffset: 2,
    phase: "inpatient",
    instructions: ["퇴원 약 수령", "외래 예약 확인", "자가 관리 교육"],
    warnings: ["고열, 마비 발생 시 응급 내원"],
    dos: ["처방 약물 복용", "상처 관리"],
    donts: ["과도한 활동 금지"],
  },
  {
    id: "fu-2w",
    title: "수술 후 2주 외래",
    dateOffset: 14,
    phase: "outpatient",
    instructions: ["상처 확인", "PROM 설문 작성"],
    warnings: ["이상 소견 시 추가 검사"],
    dos: ["일상 활동 점진적 확대"],
    donts: ["격렬한 운동 금지"],
  },
  {
    id: "fu-6w",
    title: "수술 후 6주 외래",
    dateOffset: 42,
    phase: "outpatient",
    instructions: ["영상 검사", "PROM 설문 작성", "활동 범위 확대 여부 결정"],
    warnings: [],
    dos: ["운동 시작"],
    donts: ["과도한 부하 금지"],
  },
  {
    id: "fu-3m",
    title: "수술 후 3개월 외래",
    dateOffset: 90,
    phase: "outpatient",
    instructions: ["PROM 설문 작성", "기능 평가"],
    warnings: [],
    dos: ["정상 활동 복귀"],
    donts: [],
  },
  {
    id: "fu-6m",
    title: "수술 후 6개월 외래",
    dateOffset: 180,
    phase: "outpatient",
    instructions: ["PROM 설문 작성", "최종 평가"],
    warnings: [],
    dos: ["규칙적 운동 유지"],
    donts: [],
  },
  {
    id: "fu-1y",
    title: "수술 후 1년 외래",
    dateOffset: 365,
    phase: "outpatient",
    instructions: ["최종 PROM 설문", "치료 종결 상담"],
    warnings: [],
    dos: ["장기 건강 관리"],
    donts: [],
  },
];
