import type { SurgeryTemplate } from "./types";

export const fusionTemplate: SurgeryTemplate = {
  type: "fusion",
  name: "Lumbar Fusion (TLIF/OLIF/PSF)",
  nameKo: "요추 유합술",
  abbreviation: "Fusion",
  region: "lumbar",
  durationMinutes: 180,
  stayNights: 4,
  promInstruments: ["vas", "odi", "joa", "eq5d", "eqvas"],
  vasConfig: {
    scales: [
      { id: "vas_back", label: "허리 통증" },
      { id: "vas_leg", label: "다리 통증 / 저림" },
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
        { time: "오전", activity: "혈액검사, 소변검사, 심전도, 흉부 X-ray", icon: "🔬" },
        { time: "오후", activity: "마취과 상담 및 수술 동의서 작성", icon: "📋" },
        { time: "오후", activity: "보조기 맞춤 확인, 수술 부위 준비", icon: "🦴" },
        { time: "저녁", activity: "ERAS 금식: 수술 6시간 전 식사, 2시간 전 맑은 음료 가능", icon: "📋" },
      ],
    },
    {
      day: "수술일 (D-Day)",
      dateOffset: 0,
      rows: [
        { time: "오전", activity: "수술 가운 환복, IV 확보", icon: "💉" },
        { time: "오전", activity: "수술실 이동 → 요추 유합술 시행 (약 3~4시간)", icon: "🔧" },
        { time: "오후", activity: "회복실 → 병실 복귀 (도뇨관 회복실에서 제거)", icon: "🛏️" },
        { time: "오후", activity: "하지 감각/운동 기능 확인", icon: "🦵" },
        { time: "오후", activity: "병동 복귀 즉시 보조기 착용 하 조기 보행 시작", icon: "🚶" },
        { time: "오후", activity: "연하 가능 시 즉시 식이 시작 (음료 → 식사)", icon: "🍽️" },
        { time: "저녁", activity: "다중모드 통증 관리 (ESP block + 아세트아미노펜 + NSAIDs)", icon: "💊" },
      ],
    },
    {
      day: "수술 후 1일 (POD#1)",
      dateOffset: 1,
      rows: [
        { time: "오전", activity: "보행 거리 확대", icon: "🚶" },
        { time: "오전", activity: "일반식 식이 진행", icon: "🍽️" },
        { time: "오전", activity: "배액관 제거", icon: "🩺" },
        { time: "오후", activity: "X-ray 촬영 (나사못/케이지 위치 확인)", icon: "📸" },
      ],
    },
    {
      day: "수술 후 2-3일 (POD#2-3)",
      dateOffset: 2,
      rows: [
        { time: "오전", activity: "보행 거리 확대, 복도 보행", icon: "🚶" },
        { time: "오전", activity: "계단 연습 시작", icon: "🏃" },
        { time: "오후", activity: "일상 동작 연습 (세면, 화장실)", icon: "🧼" },
        { time: "오후", activity: "퇴원 교육 (보조기, 약물, 재활)", icon: "📦" },
      ],
    },
    {
      day: "수술 후 3-4일 (POD#3-4)",
      dateOffset: 3,
      rows: [
        { time: "오전", activity: "보행 거리 확대, 계단 연습", icon: "🏃" },
        { time: "오전", activity: "일상 동작 연습 (세면, 화장실)", icon: "🧼" },
        { time: "오후", activity: "퇴원 교육 (보조기, 약물, 재활)", icon: "📦" },
        { time: "오후", activity: "퇴원 약 수령", icon: "💊" },
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
        "수술 전 혈액검사, 소변검사, 심전도, 흉부 X-ray, 폐기능 검사",
        "마취과 상담 및 동의서 작성",
        "수술 부위 피부 준비",
        "보조기(TLSO) 맞춤 확인",
        "ERAS 금식: 맑은 음료는 수술 2시간 전까지, 가벼운 식사는 6시간 전까지 가능",
      ],
      warnings: [
        "항응고제/항혈소판제 복용 시 반드시 의료진에게 알릴 것",
        "알레르기 이력 반드시 고지",
        "흡연 시 유합 실패 위험 증가 — 금연 필수",
      ],
      dos: [
        "수술 동의서 꼼꼼히 읽고 서명하기",
        "보호자 연락처 확인하기",
        "수술 전 폐활량 운동(인센티브 스파이로미터) 연습하기",
      ],
      donts: [
        "수술 6시간 전부터 고형식 금지, 2시간 전부터 맑은 음료 금지",
        "흡연 절대 금지",
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
        "수술실 이동 및 요추 유합술 시행 (약 3~4시간)",
        "나사못(pedicle screw) 고정 및 케이지 삽입",
        "회복실에서 마취 회복 후 병실 복귀 (도뇨관 회복실에서 즉시 제거)",
        "병동 복귀 즉시 보조기 착용 하 조기 보행 시작 (ERAS 프로토콜)",
        "연하 가능 시 즉시 경구 식이 시작",
        "다중모드 통증 관리 (ESP block + 아세트아미노펜 650mg 하루 3회 + 필요 시 NSAIDs, PCA/마약성 진통제 불사용)",
      ],
      warnings: [
        "수술 후 하지 감각 저하 또는 마비 발생 시 즉시 알릴 것",
        "심한 두통, 오심, 구토 시 의료진 호출",
        "수술 부위 과도한 출혈 확인",
        "대소변 장애 발생 시 즉시 보고",
      ],
      dos: [
        "병동 도착 즉시 보조기 착용하고 보행 시작하기",
        "삼킬 수 있으면 바로 음료/식사 시작하기",
        "통증 참지 말고 알리기",
        "심호흡 운동 자주 하기",
      ],
      donts: [
        "보조기 없이 움직이지 않기",
        "허리 비틀기 동작 절대 금지",
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
        "배액관 제거",
        "X-ray 촬영 (나사못/케이지 위치 확인)",
        "수술 부위 드레싱 확인",
      ],
      warnings: [
        "기립 시 어지럼증이나 하지 위약감 발생 시 즉시 중단",
        "발열(38°C 이상) 시 의료진 보고",
        "소변 보기 어려울 경우 알릴 것",
        "하지 부종이나 통증 (심부정맥 혈전증 주의) 시 보고",
      ],
      dos: [
        "보행 거리 점진적으로 늘리기",
        "심호흡, 기침 운동 자주 하기 (폐합병증 예방)",
        "충분한 수분 섭취",
        "발목 펌프 운동 자주 하기 (혈전 예방)",
      ],
      donts: [
        "보조기 없이 움직이지 않기",
        "허리 숙이기/비틀기 절대 금지 (BLT precaution)",
        "무거운 물건 들지 않기",
        "장시간 같은 자세 유지하지 않기",
      ],
    },
    {
      id: "pod2-3",
      title: "수술 후 2-3일차",
      dateOffset: 2,
      phase: "inpatient",
      instructions: [
        "보행기 이용 단거리 보행 시작",
        "일반식으로 식이 진행",
        "드레싱 상태 확인",
        "X-ray 촬영으로 나사못/케이지 위치 확인",
        "자연 배뇨 확인",
      ],
      warnings: [
        "보행 시 하지 통증 악화 시 보고",
        "배뇨 곤란 지속 시 보고",
        "하지 부종 발생 시 보고",
      ],
      dos: [
        "보조기 착용하고 보행 거리 늘리기",
        "규칙적으로 식사하기",
        "심호흡 운동 지속하기",
        "발목 펌프 운동 지속하기",
      ],
      donts: [
        "보조기 없이 활동하지 않기",
        "허리를 굽히거나 비틀지 않기 (BLT precaution)",
        "쪼그려 앉지 않기",
      ],
    },
    {
      id: "discharge",
      title: "퇴원 및 퇴원교육",
      dateOffset: 4,
      phase: "inpatient",
      instructions: [
        "퇴원 약 수령 (진통제, 근이완제, 위장약, 혈전 예방약)",
        "외래 예약 확인 (2주 후)",
        "보조기(TLSO) 착용 지침 (8~12주간)",
        "상처 관리법 교육",
        "BLT precaution 교육 (Bending, Lifting, Twisting 금지)",
        "금연 교육 (유합 성공을 위해 필수)",
      ],
      warnings: [
        "퇴원 후 38°C 이상 발열 시 응급 내원",
        "하지 마비 또는 대소변 장애 시 즉시 응급실 방문",
        "수술 부위 발적, 부종, 농성 삼출물 시 즉시 내원",
        "하지 부종/통증 (혈전 의심) 시 내원",
      ],
      dos: [
        "보조기 항상 착용하기 (수면 시 제외 가능)",
        "처방 약물 정해진 시간에 복용하기",
        "짧은 거리 산책 매일 하기",
        "상처 건조하게 유지하기",
        "BLT precaution 철저히 지키기",
      ],
      donts: [
        "5kg 이상 물건 들지 않기",
        "허리 숙이기/비틀기 절대 금지",
        "장시간 앉거나 운전하지 않기",
        "목욕탕, 사우나, 수영장 금지",
        "절대 금연",
        "쪼그려 앉기, 바닥 생활 금지",
      ],
    },
    {
      id: "fu-2w",
      title: "수술 후 2주 외래",
      dateOffset: 14,
      phase: "outpatient",
      instructions: [
        "수술 부위 상처 확인 및 실밥 제거",
        "PROM 설문 작성 (VAS, ODI, EQ-5D)",
        "신경학적 검진 (하지 감각, 근력, 반사)",
        "보행 상태 평가",
      ],
      warnings: [
        "상처 감염 소견 시 추가 처치 필요",
        "통증 악화 시 보고",
      ],
      dos: [
        "보조기 착용하고 걷기 운동 하루 20~30분",
        "BLT precaution 유지",
        "처방 약물 꾸준히 복용하기",
      ],
      donts: [
        "5kg 이상 물건 들기 금지",
        "장시간 앉기 금지 (30분마다 일어나기)",
        "격렬한 활동 금지",
      ],
      faq: [
        {
          question: "보조기를 언제 벗을 수 있나요?",
          answer: "요추 유합술 후 보조기는 보통 8~12주간 착용합니다. 유합 진행 상태를 X-ray/CT로 확인 후 의사가 결정합니다.",
        },
        {
          question: "BLT precaution이 뭔가요?",
          answer: "Bending(허리 굽히기), Lifting(물건 들기), Twisting(허리 비틀기)을 피하는 것입니다. 유합이 안정적으로 이루어질 때까지 (약 3~6개월) 이 세 동작을 최대한 자제해야 합니다.",
        },
        {
          question: "운전은 언제 가능한가요?",
          answer: "보통 수술 후 6~8주, 보조기 제거 후 안전하게 브레이크를 밟을 수 있을 때 시작합니다. 장거리 운전은 3개월 이후 권장합니다.",
        },
      ],
    },
    {
      id: "fu-6w",
      title: "수술 후 6주 외래",
      dateOffset: 42,
      phase: "outpatient",
      instructions: [
        "X-ray 촬영 (나사못/케이지 위치 확인)",
        "PROM 설문 작성 (VAS, ODI, EQ-5D)",
        "보행 및 일상 활동 평가",
        "보조기 착용 지속 여부 결정",
      ],
      warnings: [
        "나사못 이완(loosening) 의심 소견 시 추가 검사",
        "하지 방사통 재발 시 MRI 검사 필요",
      ],
      dos: [
        "가벼운 유산소 운동 시작 (걷기, 수중 걷기)",
        "BLT precaution 계속 유지",
        "바른 자세 습관 유지",
      ],
      donts: [
        "무거운 물건 들기 여전히 금지",
        "허리 과신전/과굴곡 금지",
        "조깅, 뛰기 금지",
      ],
      faq: [
        {
          question: "직장 복귀는 언제 가능한가요?",
          answer: "사무직은 6~8주, 가벼운 육체 노동은 12주, 무거운 육체 노동은 6개월 이후 복귀를 권장합니다.",
        },
        {
          question: "수영을 해도 되나요?",
          answer: "수중 걷기는 6주 후부터 가능하지만, 본격적인 수영은 보조기 제거 후 3개월 이후 시작하세요. 접영은 특히 주의가 필요합니다.",
        },
      ],
    },
    {
      id: "fu-3m",
      title: "수술 후 3개월 외래",
      dateOffset: 90,
      phase: "outpatient",
      instructions: [
        "CT 촬영 (유합 진행 상태 확인)",
        "PROM 설문 작성 (VAS, ODI, JOA, EQ-5D)",
        "코어 근력 강화 운동 시작 여부 판단",
        "일상 복귀 수준 평가",
      ],
      warnings: [
        "유합 부전(nonunion) 의심 시 추가 치료 필요",
        "인접 분절 증상 발생 시 보고",
        "나사못 관련 통증 시 보고",
      ],
      dos: [
        "코어 근력 강화 운동 시작 (의사 허가 시)",
        "보조기 없이 활동 시작 (의사 허가 시)",
        "정상 일상 활동 점진적 복귀",
        "금연 유지 필수",
      ],
      donts: [
        "고강도 허리 부하 운동 금지",
        "무거운 물건 들기 제한 (10kg 미만)",
        "접촉 스포츠 금지",
      ],
      faq: [
        {
          question: "유합이 잘 되고 있는지 어떻게 아나요?",
          answer: "CT 촬영으로 케이지 주변 골형성을 확인합니다. 3개월에 유합 진행을 확인하고, 6개월~1년에 완전 유합을 확인합니다.",
        },
        {
          question: "나사못이 평생 몸에 있는 건가요?",
          answer: "네, 대부분의 경우 나사못을 제거하지 않습니다. 유합이 완성되면 나사못은 보조 역할만 하므로 불편함이 없습니다. 다만 나사못 관련 통증이 있으면 제거를 고려할 수 있습니다.",
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
        "PROM 설문 작성 (VAS, ODI, JOA, EQ-5D)",
        "기능적 회복 평가",
        "운동 강도 상향 가능 여부 판단",
      ],
      warnings: [
        "인접 분절 퇴행 증상 모니터링",
        "만성 통증 양상이 있으면 통증 클리닉 연계",
      ],
      dos: [
        "다양한 운동 활동 점진적 확대",
        "코어 운동 꾸준히 유지",
        "직장/사회 활동 정상 수행",
        "체중 관리",
      ],
      donts: [
        "데드리프트 등 고중량 허리 부하 운동 자제",
        "장시간 잘못된 자세로 업무하지 않기",
      ],
      faq: [
        {
          question: "골프를 해도 되나요?",
          answer: "6개월 시점에서 유합 진행이 확인되면 가벼운 스윙부터 시작할 수 있습니다. 풀 스윙은 1년 이후 권장합니다.",
        },
      ],
    },
    {
      id: "fu-1y",
      title: "수술 후 1년 외래",
      dateOffset: 365,
      phase: "outpatient",
      instructions: [
        "최종 PROM 설문 작성 (VAS, ODI, JOA, EQ-5D)",
        "CT 촬영 (최종 유합 확인)",
        "최종 기능 평가 및 치료 종결 상담",
        "장기 관리 계획 수립",
      ],
      warnings: [
        "인접 분절 퇴행 가능성 교육",
        "재발 증상 시 조기 내원 권고",
      ],
      dos: [
        "평생 코어 근력 운동 유지",
        "바른 자세 습관 생활화",
        "적정 체중 유지",
        "정기 건강검진 시 척추 상태 확인",
      ],
      donts: [
        "장기간 허리 건강 관리 소홀히 하지 않기",
        "증상 재발 시 자가 판단으로 방치하지 않기",
      ],
      faq: [
        {
          question: "유합 부위 위아래에 문제가 생길 수 있나요?",
          answer: "인접 분절 퇴행(ASD)이 연간 약 2~4% 발생할 수 있습니다. 코어 운동, 바른 자세, 체중 관리, 금연이 예방에 중요합니다.",
        },
        {
          question: "앞으로 정기 검진이 필요한가요?",
          answer: "유합이 완성되고 증상이 없으면 정기 추적은 필수는 아닙니다. 다만 새로운 증상이 발생하면 바로 내원하세요.",
        },
      ],
    },
  ],
};
