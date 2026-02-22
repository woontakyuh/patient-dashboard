import type { SurgeryTemplate } from "./types";

export const acdfTemplate: SurgeryTemplate = {
  type: "acdf",
  name: "Anterior Cervical Discectomy and Fusion",
  nameKo: "전방 경추 추간판 제거 및 유합술",
  abbreviation: "ACDF",
  region: "cervical",
  durationMinutes: 120,
  stayNights: 2,
  promInstruments: ["vas", "ndi", "joa", "eq5d", "eqvas"],
  vasConfig: {
    scales: [
      { id: "vas_neck", label: "목 통증" },
      { id: "vas_arm", label: "팔 통증 / 저림" },
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
      day: "입원일 (D-1)",
      dateOffset: -1,
      rows: [
        { time: "오전", activity: "입원 수속 및 병실 배정", icon: "🏥" },
        { time: "오전", activity: "혈액검사, 심전도, 흉부 X-ray", icon: "🔬" },
        { time: "오후", activity: "마취과 상담 및 수술 동의서 작성", icon: "📋" },
        { time: "오후", activity: "경추 보조기 맞춤 확인", icon: "🦴" },
        { time: "저녁", activity: "ERAS 금식: 수술 6시간 전 식사, 2시간 전 맑은 음료 가능", icon: "📋" },
      ],
    },
    {
      day: "수술일 (D-Day)",
      dateOffset: 0,
      rows: [
        { time: "오전", activity: "수술 가운 환복, IV 확보", icon: "💉" },
        { time: "오전", activity: "수술실 이동 → ACDF 시행 (약 1.5~2시간)", icon: "🔧" },
        { time: "오후", activity: "회복실 → 병실 복귀", icon: "🛏️" },
        { time: "오후", activity: "상지 감각/운동 기능 확인, 삼킴 기능 확인", icon: "🦾" },
        { time: "저녁", activity: "병동 복귀 즉시 경추 보조기 착용 하 조기 보행 시작", icon: "🚶" },
        { time: "오후", activity: "삼킴 확인 후 즉시 식이 시작 (음료 → 부드러운 식사)", icon: "🍽️" },
        { time: "저녁", activity: "다중모드 통증 관리 (아세트아미노펜 + NSAIDs)", icon: "💊" },
      ],
    },
    {
      day: "수술 후 1일 (POD#1)",
      dateOffset: 1,
      rows: [
        { time: "오전", activity: "보행 거리 확대", icon: "🚶" },
        { time: "오전", activity: "일반식 식이 진행", icon: "🍽️" },
        { time: "오후", activity: "보행 거리 점진적 확대", icon: "🏃" },
        { time: "오후", activity: "배액관 제거 (의사 판단)", icon: "🩺" },
      ],
    },
    {
      day: "수술 후 2일 (POD#2)",
      dateOffset: 2,
      rows: [
        { time: "오전", activity: "X-ray 촬영 (임플란트 위치 확인)", icon: "📸" },
        { time: "오전", activity: "보행 거리 확대", icon: "🚶" },
        { time: "오후", activity: "퇴원 교육 및 약 수령", icon: "📦" },
        { time: "오후", activity: "경추 보조기 관리 교육", icon: "📋" },
      ],
    },
  ],
  stages: [
    {
      id: "pre-op",
      title: "수술 전 준비 (입원 당일)",
      dateOffset: -1,
      phase: "inpatient",
      instructions: [
        "입원 수속 및 병실 배정",
        "수술 전 혈액검사, 심전도, 흉부 X-ray 시행",
        "마취과 상담 및 동의서 작성",
        "경추 보조기(필라델피아 칼라) 맞춤 확인",
        "ERAS 금식: 맑은 음료는 수술 2시간 전까지, 가벼운 식사는 6시간 전까지 가능",
      ],
      warnings: [
        "항응고제/항혈소판제 복용 시 반드시 의료진에게 알릴 것",
        "알레르기 이력 반드시 고지",
        "목 부위 피부 상태 확인 (감염 소견 시 수술 연기 가능)",
      ],
      dos: [
        "수술 동의서 꼼꼼히 읽고 서명하기",
        "보호자 연락처 확인하기",
        "개인 귀중품은 보호자에게 맡기기",
      ],
      donts: [
        "수술 6시간 전부터 고형식 금지, 2시간 전부터 맑은 음료 금지",
        "흡연 금지 (유합률 저하 위험)",
        "임의로 약 복용하지 않기",
      ],
    },
    {
      id: "surgery-day",
      title: "수술 당일",
      dateOffset: 0,
      phase: "inpatient",
      instructions: [
        "수술 가운으로 환복",
        "정맥 주사(IV) 확보",
        "수술실 이동 및 전방 경추 추간판 제거 유합술 시행 (약 1.5~2시간)",
        "회복실에서 마취 회복 후 병실 복귀",
        "수술 후 상지 감각/운동 기능 및 삼킴 기능 확인",
        "병동 복귀 즉시 경추 보조기 착용 하 조기 보행 시작 (ERAS 프로토콜)",
        "삼킴 검사 후 가능 시 즉시 경구 식이 시작",
        "다중모드 통증 관리 (아세트아미노펜 650mg 하루 3회 + 필요 시 NSAIDs, 마약성 진통제 불사용)",
      ],
      warnings: [
        "상지 감각 저하, 근력 약화 발생 시 즉시 알릴 것",
        "삼키기 어렵거나 목소리 변화 시 의료진 호출",
        "호흡 곤란 발생 시 즉시 알릴 것",
        "수술 부위(목 전방) 부종이 심해질 경우 보고",
      ],
      dos: [
        "경추 보조기 착용 상태 유지하기",
        "병동 도착 즉시 보행 시작하기 (경추 보조기 착용)",
        "삼킬 수 있으면 바로 음료/식사 시작하기",
        "통증 참지 말고 알리기",
      ],
      donts: [
        "목을 급격히 움직이거나 비틀지 않기",
        "경추 보조기를 임의로 벗지 않기",
        "수술 부위 만지지 않기",
      ],
    },
    {
      id: "pod1",
      title: "수술 후 1일차 (POD#1)",
      dateOffset: 1,
      phase: "inpatient",
      instructions: [
        "보행 거리 점진적 확대",
        "일반식 식이 진행",
        "보행 거리 확대, 복도 보행",
        "배액관 제거 (의사 판단 하)",
        "수술 부위 드레싱 확인",
      ],
      warnings: [
        "삼킴 곤란이 지속되면 보고 (보통 수일 내 호전)",
        "목소리 변화(쉰 목소리) 시 보고",
        "발열(38°C 이상) 시 의료진 보고",
      ],
      dos: [
        "경추 보조기 항상 착용하고 보행하기",
        "부드러운 음식부터 천천히 섭취하기",
        "심호흡 운동 자주 하기",
      ],
      donts: [
        "경추 보조기 없이 움직이지 않기",
        "목을 과도하게 숙이거나 젖히지 않기",
        "무거운 물건 들지 않기",
      ],
    },
    {
      id: "discharge",
      title: "퇴원 및 퇴원교육",
      dateOffset: 2,
      phase: "inpatient",
      instructions: [
        "퇴원 약 수령 (진통제, 근이완제, 위장약)",
        "외래 예약 확인 (2주 후)",
        "경추 보조기 착용 지침 교육 (6~12주간)",
        "상처 관리법 교육",
        "금연 교육 (유합률 향상을 위해 필수)",
      ],
      warnings: [
        "퇴원 후 삼킴 곤란 악화 시 즉시 내원",
        "상지 마비 또는 근력 저하 시 응급실 방문",
        "호흡 곤란 시 즉시 119 호출",
        "수술 부위 발적, 부종, 농성 삼출물 시 내원",
      ],
      dos: [
        "경추 보조기 수면 시에도 착용하기",
        "처방 약물 정해진 시간에 복용하기",
        "짧은 거리 산책하기",
        "부드러운 음식 위주 섭취 (삼킴 불편 시)",
      ],
      donts: [
        "2kg 이상 물건 들지 않기",
        "장시간 고개 숙이기 (스마트폰, 독서) 금지",
        "절대 금연",
        "격렬한 활동 금지",
      ],
    },
    {
      id: "fu-2w",
      title: "수술 후 2주 외래",
      dateOffset: 14,
      phase: "outpatient",
      instructions: [
        "수술 부위 상처 확인 및 실밥 제거",
        "PROM 설문 작성 (VAS, NDI, EQ-5D)",
        "신경학적 검진 (상지 감각, 근력, 반사)",
        "삼킴 기능 회복 확인",
      ],
      warnings: [
        "상처 감염 소견 시 추가 처치 필요",
        "통증 악화 시 보고",
      ],
      dos: [
        "경추 보조기 지속 착용하기",
        "일상 생활 동작 점진적으로 늘리기",
        "걷기 운동 하루 20~30분",
      ],
      donts: [
        "무거운 물건 들기 금지",
        "장시간 컴퓨터/스마트폰 사용 자제",
        "목에 무리가 가는 활동 금지",
      ],
      faq: [
        {
          question: "목 앞쪽 수술 상처가 눈에 띄나요?",
          answer: "ACDF 수술은 목 앞쪽 피부 주름을 따라 절개하므로, 시간이 지나면 거의 보이지 않게 됩니다. 보통 3~4cm 정도입니다.",
        },
        {
          question: "삼키기 불편한 증상은 언제 좋아지나요?",
          answer: "대부분 수술 후 1~2주 내에 호전됩니다. 드물게 수주간 지속될 수 있으나, 거의 모든 환자에서 완전 회복됩니다.",
        },
        {
          question: "경추 보조기는 언제 벗을 수 있나요?",
          answer: "보통 수술 후 6~12주간 착용합니다. 유합 상태를 X-ray로 확인 후 의사가 결정합니다.",
        },
      ],
    },
    {
      id: "fu-6w",
      title: "수술 후 6주 외래",
      dateOffset: 42,
      phase: "outpatient",
      instructions: [
        "X-ray 촬영 (유합 진행 상태 확인)",
        "PROM 설문 작성 (VAS, NDI, EQ-5D)",
        "경추 보조기 착용 지속/중단 결정",
        "재활 운동 시작 여부 평가",
      ],
      warnings: [
        "유합 지연 소견 시 보조기 착용 기간 연장 가능",
        "상지 방사통 재발 시 추가 검사 필요",
      ],
      dos: [
        "경추 등척성 운동 시작 (의사 허가 시)",
        "바른 자세 습관 (모니터 높이 조절)",
        "가벼운 유산소 운동 (걷기, 고정 자전거)",
      ],
      donts: [
        "목을 강하게 회전하거나 젖히지 않기",
        "머리 위로 물건 들기 금지",
        "접촉 스포츠 금지",
      ],
      faq: [
        {
          question: "운전은 언제부터 할 수 있나요?",
          answer: "경추 보조기 착용 중에는 목 회전이 제한되어 운전이 어렵습니다. 보조기 제거 후 안전하게 좌우를 확인할 수 있을 때 시작하세요.",
        },
        {
          question: "직장 복귀는 가능한가요?",
          answer: "사무직은 수술 후 4~6주, 육체 노동은 12주 이후 가능합니다. 목에 부담이 적은 업무부터 시작하세요.",
        },
      ],
    },
    {
      id: "fu-3m",
      title: "수술 후 3개월 외래",
      dateOffset: 90,
      phase: "outpatient",
      instructions: [
        "CT 촬영 (유합 확인)",
        "PROM 설문 작성 (VAS, NDI, JOA, EQ-5D)",
        "경추 운동 범위 평가",
        "일상 복귀 수준 평가",
      ],
      warnings: [
        "유합 부전(nonunion) 시 추가 치료 필요 가능",
        "인접 분절 증상 발생 시 보고",
      ],
      dos: [
        "경추 스트레칭 및 강화 운동 시작",
        "정상 일상 활동 점진적 복귀",
        "금연 유지 (유합 완성까지 필수)",
      ],
      donts: [
        "고강도 목 부하 운동 금지",
        "다이빙, 롤러코스터 등 목에 충격 가는 활동 금지",
      ],
      faq: [
        {
          question: "유합이 잘 되었는지 어떻게 아나요?",
          answer: "CT 촬영으로 케이지 주변 골형성을 확인합니다. 보통 3~6개월에 유합이 진행되고, 1년에 완전 유합됩니다.",
        },
      ],
    },
    {
      id: "fu-6m",
      title: "수술 후 6개월 외래",
      dateOffset: 180,
      phase: "outpatient",
      instructions: [
        "X-ray 촬영 (유합 진행 확인)",
        "PROM 설문 작성 (VAS, NDI, JOA, EQ-5D)",
        "기능적 회복 평가",
        "운동 강도 상향 가능 여부 판단",
      ],
      warnings: [
        "인접 분절 퇴행 증상 모니터링",
      ],
      dos: [
        "다양한 운동 활동 점진적 확대",
        "직장/사회 활동 정상 수행",
        "경추 근력 운동 유지",
      ],
      donts: [
        "급격한 고강도 운동 전환 금지",
        "장시간 잘못된 자세 유지하지 않기",
      ],
    },
    {
      id: "fu-1y",
      title: "수술 후 1년 외래",
      dateOffset: 365,
      phase: "outpatient",
      instructions: [
        "최종 PROM 설문 작성 (VAS, NDI, JOA, EQ-5D)",
        "CT 촬영 (최종 유합 확인)",
        "최종 기능 평가 및 치료 종결 상담",
        "장기 관리 계획 수립",
      ],
      warnings: [
        "인접 분절 퇴행 가능성 교육",
        "재발 증상 시 조기 내원 권고",
      ],
      dos: [
        "경추 근력 운동 꾸준히 유지",
        "바른 자세 습관 생활화",
        "정기 건강검진 시 경추 상태 확인",
      ],
      donts: [
        "장기간 목 건강 관리 소홀히 하지 않기",
        "증상 재발 시 방치하지 않기",
      ],
      faq: [
        {
          question: "유합된 부위 위아래 디스크에 문제가 생길 수 있나요?",
          answer: "인접 분절 퇴행(ASD)이 연간 약 3% 정도 발생할 수 있습니다. 바른 자세와 목 근력 운동으로 예방할 수 있습니다.",
        },
      ],
    },
  ],
};
