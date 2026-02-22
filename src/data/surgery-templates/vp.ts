import type { SurgeryTemplate } from "./types";

export const vpTemplate: SurgeryTemplate = {
  type: "vp",
  name: "Vertebroplasty",
  nameKo: "척추체 성형술",
  abbreviation: "VP",
  region: "thoracolumbar",
  durationMinutes: 30,
  stayNights: 1,
  promInstruments: ["vas", "odi", "eq5d", "eqvas"],
  vasConfig: {
    scales: [
      { id: "vas_back", label: "허리/등 통증" },
    ],
  },
  followUpOffsets: [
    { label: "2주 외래", daysAfterSurgery: 14 },
    { label: "6주 외래", daysAfterSurgery: 42 },
    { label: "3개월 외래", daysAfterSurgery: 90 },
    { label: "6개월 외래", daysAfterSurgery: 180 },
    { label: "1년 외래", daysAfterSurgery: 365 },
  ],
  inpatientSchedule: [
    {
      day: "입원일/수술일 (D-Day)",
      dateOffset: 0,
      rows: [
        { time: "오전", activity: "입원 수속, 혈액검사, 심전도", icon: "🏥" },
        { time: "오전", activity: "마취과 상담 및 동의서 작성", icon: "📋" },
        { time: "오후", activity: "국소/전신 마취 하 척추체 성형술 (약 30분)", icon: "🔧" },
        { time: "오후", activity: "회복실 안정 → 병실 복귀", icon: "🛏️" },
        { time: "저녁", activity: "2시간 앙와위(바로 누운) 안정", icon: "⏳" },
        { time: "저녁", activity: "2시간 안정 후 조기 보행 시작", icon: "🚶" },
        { time: "저녁", activity: "연하 가능 시 즉시 식이 시작", icon: "🍽️" },
        { time: "저녁", activity: "다중모드 통증 관리 (아세트아미노펜 + NSAIDs)", icon: "💊" },
      ],
    },
    {
      day: "수술 후 1일 (POD#1)",
      dateOffset: 1,
      rows: [
        { time: "오전", activity: "보행 거리 확대", icon: "🚶" },
        { time: "오전", activity: "X-ray 촬영 (시멘트 위치 확인)", icon: "📸" },
        { time: "오후", activity: "퇴원 교육 및 약 수령", icon: "📦" },
        { time: "오후", activity: "골다공증 치료 약물 교육", icon: "💊" },
      ],
    },
  ],
  stages: [
    {
      id: "pre-op",
      title: "수술 전 준비",
      dateOffset: -1,
      phase: "inpatient",
      instructions: [
        "입원 수속 및 혈액검사, 심전도 시행",
        "골밀도 검사(DEXA) 결과 확인",
        "마취과 상담 및 동의서 작성",
        "골절 부위 영상 검토 (X-ray, MRI, CT)",
        "ERAS 금식: 맑은 음료는 수술 2시간 전까지, 가벼운 식사는 6시간 전까지 가능",
      ],
      warnings: [
        "항응고제 복용 중이면 반드시 의료진에게 알릴 것",
        "약물 알레르기 (특히 조영제, 시멘트 성분) 고지",
      ],
      dos: [
        "현재 복용 중인 약물 목록 준비하기",
        "보호자 동반 확인",
        "수술 전 통증 수준 기록해두기",
      ],
      donts: [
        "수술 6시간 전부터 고형식 금지, 2시간 전부터 맑은 음료 금지",
        "임의로 약 복용하지 않기",
      ],
    },
    {
      id: "surgery-day",
      title: "수술 당일",
      dateOffset: 0,
      phase: "inpatient",
      instructions: [
        "수술 가운 환복, IV 확보",
        "투시(C-arm) 유도 하 골절 추체에 바늘 삽입",
        "골시멘트(PMMA) 주입 (약 30분 소요)",
        "시멘트 경화 확인 후 시술 종료",
        "회복실 관찰 후 병실 복귀",
        "2시간 앙와위 안정 후 조기 보행 시작 (ERAS 프로토콜)",
        "연하 가능 시 즉시 경구 식이 시작",
        "다중모드 통증 관리 (아세트아미노펜 650mg 하루 3회 + 필요 시 NSAIDs)",
      ],
      warnings: [
        "시술 후 하지 감각 이상이나 마비 발생 시 즉시 알릴 것",
        "흉통, 호흡곤란 발생 시 즉시 의료진 호출",
        "시멘트 누출에 의한 증상 모니터링",
      ],
      dos: [
        "시술 후 2시간 바로 누운 자세 유지하기",
        "통증 변화 정확히 전달하기",
        "심호흡 운동하기",
        "2시간 안정 후 바로 보행 시작하기",
        "삼킬 수 있으면 바로 음료/식사 시작하기",
      ],
      donts: [
        "시술 직후 급하게 일어나지 않기",
        "허리 비틀기 동작 금지",
      ],
    },
    {
      id: "pod1",
      title: "수술 후 1일차 (POD#1)",
      dateOffset: 1,
      phase: "inpatient",
      instructions: [
        "보행 거리 점진적 확대",
        "X-ray 촬영으로 시멘트 위치 확인",
        "통증 변화 평가",
        "골다공증 치료 약물 처방 확인",
      ],
      warnings: [
        "보행 시 현기증이나 하지 위약감 발생 시 즉시 중단",
        "새로운 부위의 통증 발생 시 보고",
      ],
      dos: [
        "보조기 착용하고 천천히 걷기",
        "충분한 수분과 영양 섭취",
        "낙상 주의하기",
      ],
      donts: [
        "보조기 없이 활동하지 않기",
        "무거운 물건 들지 않기",
        "급하게 일어나지 않기 (기립성 저혈압 주의)",
      ],
    },
    {
      id: "discharge",
      title: "퇴원 및 퇴원교육",
      dateOffset: 1,
      phase: "inpatient",
      instructions: [
        "퇴원 약 수령 (진통제, 골다공증 약물)",
        "외래 예약 확인 (2주 후)",
        "골다공증 관리 교육 (칼슘, 비타민D, 운동)",
        "낙상 예방 교육",
        "보조기 착용 지침 안내",
      ],
      warnings: [
        "퇴원 후 심한 통증 악화 시 내원",
        "하지 마비 또는 대소변 장애 시 즉시 응급실 방문",
        "발열 38°C 이상 시 내원",
      ],
      dos: [
        "골다공증 약물 꾸준히 복용하기",
        "칼슘 + 비타민D 매일 보충하기",
        "실내 낙상 위험 요소 제거하기 (미끄러운 바닥, 전선 등)",
        "가벼운 걷기 운동 매일 하기",
      ],
      donts: [
        "허리를 과도하게 굽히는 동작 금지",
        "무거운 물건 들기 금지",
        "미끄러운 곳에서 활동 금지",
        "장시간 앉거나 서 있지 않기",
      ],
    },
    {
      id: "fu-2w",
      title: "수술 후 2주 외래",
      dateOffset: 14,
      phase: "outpatient",
      instructions: [
        "시술 부위 상태 확인",
        "PROM 설문 작성 (VAS, ODI, EQ-5D)",
        "통증 변화 평가",
        "골다공증 약물 복용 상태 확인",
      ],
      warnings: [
        "통증이 오히려 악화된 경우 추가 검사 필요",
        "다른 부위의 새로운 통증 발생 시 인접 추체 골절 가능성",
      ],
      dos: [
        "걷기 운동 하루 20~30분",
        "골다공증 약물 꾸준히 복용하기",
        "칼슘/비타민D 보충 유지",
      ],
      donts: [
        "허리에 충격이 가는 활동 금지",
        "장시간 앉기 자제",
      ],
      faq: [
        {
          question: "시멘트가 빠질 수 있나요?",
          answer: "골시멘트는 주입 후 수분 내에 굳어 추체에 단단히 고정됩니다. 정상 활동으로 빠지지 않습니다.",
        },
        {
          question: "다른 뼈도 골절될 수 있나요?",
          answer: "골다공증이 있으므로 다른 추체에도 골절이 발생할 수 있습니다. 골다공증 치료와 낙상 예방이 매우 중요합니다.",
        },
      ],
    },
    {
      id: "fu-6w",
      title: "수술 후 6주 외래",
      dateOffset: 42,
      phase: "outpatient",
      instructions: [
        "X-ray 촬영 (추체 높이 유지 확인)",
        "PROM 설문 작성 (VAS, ODI, EQ-5D)",
        "골다공증 치료 효과 평가",
        "보조기 착용 중단 여부 결정",
      ],
      warnings: [
        "인접 추체 골절 발생 시 추가 시술 필요 가능",
      ],
      dos: [
        "저강도 운동 시작 (걷기, 수중 운동)",
        "균형 감각 운동하기",
        "바른 자세 유지하기",
      ],
      donts: [
        "무거운 물건 들기 금지",
        "허리를 급격히 비틀거나 굽히지 않기",
      ],
      faq: [
        {
          question: "보조기를 언제 벗을 수 있나요?",
          answer: "보통 4~6주 후 X-ray 확인 후 보조기 중단을 결정합니다. 골밀도와 통증 상태를 고려합니다.",
        },
        {
          question: "어떤 운동이 좋은가요?",
          answer: "걷기와 수중 운동이 가장 안전합니다. 등 근력 강화 운동을 점진적으로 시작하세요. 넘어지지 않는 안전한 환경에서 운동하세요.",
        },
      ],
    },
    {
      id: "fu-3m",
      title: "수술 후 3개월 외래",
      dateOffset: 90,
      phase: "outpatient",
      instructions: [
        "X-ray 촬영",
        "PROM 설문 작성 (VAS, ODI, EQ-5D)",
        "골밀도 검사 추적 (필요 시)",
        "일상 복귀 수준 평가",
      ],
      warnings: [
        "새로운 부위의 통증 발생 시 보고",
      ],
      dos: [
        "규칙적인 운동 습관 유지",
        "균형 잡힌 식사 (칼슘, 단백질)",
        "정기적 골다공증 약물 복용",
      ],
      donts: [
        "고강도 충격 운동 자제",
        "낙상 위험 활동 자제",
      ],
    },
    {
      id: "fu-6m",
      title: "수술 후 6개월 외래",
      dateOffset: 180,
      phase: "outpatient",
      instructions: [
        "PROM 설문 작성 (VAS, ODI, EQ-5D)",
        "기능적 회복 평가",
        "골다공증 치료 약물 조정",
      ],
      warnings: [
        "만성 통증 시 통증 클리닉 연계 고려",
      ],
      dos: [
        "일상 활동 정상 수행",
        "낙상 예방 환경 유지",
        "골다공증 관리 지속",
      ],
      donts: [
        "골다공증 약물 임의 중단 금지",
      ],
    },
    {
      id: "fu-1y",
      title: "수술 후 1년 외래",
      dateOffset: 365,
      phase: "outpatient",
      instructions: [
        "최종 PROM 설문 작성 (VAS, ODI, EQ-5D)",
        "골밀도 검사 (DEXA) 추적",
        "최종 기능 평가 및 장기 관리 계획",
        "골다공증 치료 지속 여부 상담",
      ],
      warnings: [
        "인접 추체 골절 재발 가능성 인지",
        "새로운 증상 시 조기 내원",
      ],
      dos: [
        "평생 골다공증 관리 (약물 + 운동 + 영양)",
        "정기 골밀도 검사",
        "낙상 예방 생활화",
        "적절한 체중 유지",
      ],
      donts: [
        "골다공증 관리 소홀히 하지 않기",
        "증상 발생 시 방치하지 않기",
      ],
    },
  ],
};
