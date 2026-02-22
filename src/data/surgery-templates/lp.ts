import type { SurgeryTemplate } from "./types";

export const lpTemplate: SurgeryTemplate = {
  type: "lp",
  name: "Laminoplasty / Laminectomy",
  nameKo: "추궁판 성형술 / 추궁 절제술",
  abbreviation: "LP",
  region: "cervical",
  durationMinutes: 150,
  stayNights: 3,
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
        { time: "오전", activity: "혈액검사, 심전도, 흉부 X-ray, 경추 MRI 확인", icon: "🔬" },
        { time: "오후", activity: "마취과 상담 및 수술 동의서 작성", icon: "📋" },
        { time: "오후", activity: "경추 보조기 준비", icon: "🦴" },
        { time: "저녁", activity: "ERAS 금식: 수술 6시간 전 식사, 2시간 전 맑은 음료 가능", icon: "📋" },
      ],
    },
    {
      day: "수술일 (D-Day)",
      dateOffset: 0,
      rows: [
        { time: "오전", activity: "수술 가운 환복, IV 확보", icon: "💉" },
        { time: "오전", activity: "수술실 이동 → 추궁판 성형/절제술 (약 2~2.5시간)", icon: "🔧" },
        { time: "오후", activity: "회복실 → 병실 복귀", icon: "🛏️" },
        { time: "오후", activity: "사지 감각/운동 기능 확인", icon: "🦾" },
        { time: "저녁", activity: "병동 복귀 즉시 경추 보조기 착용 하 조기 보행 시작", icon: "💊" },
        { time: "오후", activity: "연하 가능 시 즉시 식이 시작", icon: "🍽️" },
        { time: "저녁", activity: "다중모드 통증 관리 (아세트아미노펜 + NSAIDs)", icon: "💊" },
      ],
    },
    {
      day: "수술 후 1일 (POD#1)",
      dateOffset: 1,
      rows: [
        { time: "오전", activity: "보행 거리 확대", icon: "🚶" },
        { time: "오전", activity: "일반식 진행", icon: "🍽️" },
        { time: "오후", activity: "배액관 제거", icon: "🩺" },
        { time: "오후", activity: "단거리 보행 시작", icon: "🏃" },
      ],
    },
    {
      day: "수술 후 2-3일 (POD#2-3)",
      dateOffset: 2,
      rows: [
        { time: "오전", activity: "드레싱 상태 확인", icon: "🩺" },
        { time: "오전", activity: "X-ray 촬영 (수술 부위 확인)", icon: "📸" },
        { time: "오후", activity: "보행 거리 확대", icon: "🚶" },
        { time: "오후", activity: "퇴원 교육 및 약 수령", icon: "📦" },
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
        "경추 MRI 및 CT 영상 확인",
        "마취과 상담 및 동의서 작성",
        "경추 보조기 준비",
        "ERAS 금식: 맑은 음료는 수술 2시간 전까지, 가벼운 식사는 6시간 전까지 가능",
      ],
      warnings: [
        "항응고제/항혈소판제 복용 시 반드시 의료진에게 알릴 것",
        "알레르기 이력 반드시 고지",
      ],
      dos: [
        "수술 동의서 꼼꼼히 읽고 서명하기",
        "보호자 연락처 확인하기",
        "현재 증상 (손저림, 보행장애 등) 정확히 전달하기",
      ],
      donts: [
        "수술 6시간 전부터 고형식 금지, 2시간 전부터 맑은 음료 금지",
        "흡연 금지",
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
        "수술실 이동 및 추궁판 성형/절제술 시행 (약 2~2.5시간)",
        "후방 접근으로 척추관 확장",
        "회복실에서 마취 회복 후 병실 복귀",
        "병동 복귀 즉시 경추 보조기 착용 하 조기 보행 시작 (ERAS 프로토콜)",
        "연하 가능 시 즉시 경구 식이 시작",
        "다중모드 통증 관리 (아세트아미노펜 650mg 하루 3회 + 필요 시 NSAIDs, 마약성 진통제 불사용)",
      ],
      warnings: [
        "사지 감각 저하 또는 근력 약화 발생 시 즉시 알릴 것",
        "심한 두통, 오심, 구토 시 의료진 호출",
        "수술 부위 과도한 출혈 확인",
        "호흡 곤란 시 즉시 보고",
      ],
      dos: [
        "경추 보조기 착용 유지하기",
        "병동 도착 즉시 보행 시작하기 (경추 보조기 착용)",
        "삼킬 수 있으면 바로 음료/식사 시작하기",
        "통증 참지 말고 알리기",
      ],
      donts: [
        "목을 급격히 움직이지 않기",
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
        "배액관 제거",
        "단거리 보행 시작",
        "수술 부위 드레싱 확인",
      ],
      warnings: [
        "보행 시 균형감각 이상이나 하지 위약감 발생 시 즉시 중단",
        "발열(38°C 이상) 시 의료진 보고",
        "손 기능 변화 (젓가락 사용, 단추 채우기 등) 관찰",
      ],
      dos: [
        "경추 보조기 착용하고 천천히 보행하기",
        "심호흡 운동 자주 하기",
        "충분한 수분 섭취",
        "손가락 운동 (주먹 쥐기, 펴기) 자주 하기",
      ],
      donts: [
        "경추 보조기 없이 걷지 않기",
        "목을 숙이거나 젖히지 않기",
        "무거운 물건 들지 않기",
      ],
    },
    {
      id: "discharge",
      title: "퇴원 및 퇴원교육",
      dateOffset: 3,
      phase: "inpatient",
      instructions: [
        "퇴원 약 수령 (진통제, 근이완제, 위장약)",
        "외래 예약 확인 (2주 후)",
        "경추 보조기 착용 지침 (6~8주간)",
        "상처 관리법 교육",
        "재활 운동 교육자료 수령",
      ],
      warnings: [
        "퇴원 후 사지 마비 악화 시 즉시 응급실 방문",
        "발열 38°C 이상 시 내원",
        "수술 부위 발적, 부종, 삼출물 시 내원",
        "대소변 장애 발생 시 응급 내원",
      ],
      dos: [
        "경추 보조기 항상 착용하기 (수면 시 포함)",
        "처방 약물 정해진 시간에 복용하기",
        "가벼운 산책하기",
        "손가락/팔 기능 운동 꾸준히 하기",
      ],
      donts: [
        "2kg 이상 물건 들지 않기",
        "장시간 고개 숙이기 금지",
        "운전 금지 (보조기 착용 중)",
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
        "신경학적 검진 (사지 감각, 근력, 반사, 보행)",
        "손 기능 회복 상태 평가",
      ],
      warnings: [
        "상처 감염 소견 시 추가 처치 필요",
        "C5 palsy (삼각근 약화) 발생 시 보고",
      ],
      dos: [
        "경추 보조기 지속 착용하기",
        "걷기 운동 하루 20~30분",
        "손 기능 운동 꾸준히 하기",
      ],
      donts: [
        "무거운 물건 들기 금지",
        "목에 무리가 가는 활동 금지",
      ],
      faq: [
        {
          question: "수술 후 손 기능이 나아질까요?",
          answer: "척수 압박이 해소되면 손 기능이 점진적으로 호전됩니다. 완전 회복까지 수개월이 걸릴 수 있으며, 수술 전 증상 기간이 짧을수록 회복이 좋습니다.",
        },
        {
          question: "목 뒤쪽 통증이 지속되는데 괜찮나요?",
          answer: "후방 수술 후 목 뒤 근육통은 흔합니다. 보통 수주~수개월에 걸쳐 호전됩니다. 심한 경우 물리치료가 도움됩니다.",
        },
      ],
    },
    {
      id: "fu-6w",
      title: "수술 후 6주 외래",
      dateOffset: 42,
      phase: "outpatient",
      instructions: [
        "X-ray 촬영 (수술 부위 경과 확인)",
        "PROM 설문 작성 (VAS, NDI, EQ-5D)",
        "경추 보조기 착용 중단 여부 결정",
        "재활 운동 시작 여부 평가",
      ],
      warnings: [
        "경추 운동 범위 감소 시 추가 평가 필요",
        "상지 증상 악화 시 MRI 추가 검사",
      ],
      dos: [
        "경추 등척성 운동 시작 (의사 허가 시)",
        "바른 자세 유지 (모니터/베개 높이 조절)",
        "가벼운 유산소 운동",
      ],
      donts: [
        "목을 강하게 회전하거나 꺾지 않기",
        "머리 위로 물건 들기 금지",
        "접촉 스포츠 금지",
      ],
      faq: [
        {
          question: "목 운동 범위가 줄어드나요?",
          answer: "추궁판 성형술은 운동 범위를 보존하는 수술이지만, 초기에는 근육 경직으로 운동 범위가 제한될 수 있습니다. 재활 운동으로 점차 회복됩니다.",
        },
      ],
    },
    {
      id: "fu-3m",
      title: "수술 후 3개월 외래",
      dateOffset: 90,
      phase: "outpatient",
      instructions: [
        "MRI 촬영 (척수 감압 상태 확인)",
        "PROM 설문 작성 (VAS, NDI, JOA, EQ-5D)",
        "경추 운동 범위 및 근력 평가",
        "일상 복귀 수준 평가",
      ],
      warnings: [
        "척수증 증상 재발 시 보고",
        "새로운 증상 발생 시 보고",
      ],
      dos: [
        "경추 스트레칭 및 강화 운동",
        "정상 일상 활동 점진적 복귀",
        "수영 등 저강도 운동 시작",
      ],
      donts: [
        "고강도 목 부하 운동 금지",
        "목에 충격이 가는 활동 금지",
      ],
    },
    {
      id: "fu-6m",
      title: "수술 후 6개월 외래",
      dateOffset: 180,
      phase: "outpatient",
      instructions: [
        "PROM 설문 작성 (VAS, NDI, JOA, EQ-5D)",
        "기능적 회복 평가",
        "운동 강도 상향 가능 여부 판단",
      ],
      warnings: [
        "만성 경부통 시 통증 관리 상담",
      ],
      dos: [
        "다양한 운동 활동 점진적 확대",
        "경추 근력 운동 유지",
        "직장/사회 활동 정상 수행",
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
        "MRI 촬영 (필요 시)",
        "최종 기능 평가 및 치료 종결 상담",
        "장기 관리 계획 수립",
      ],
      warnings: [
        "인접 분절 퇴행 가능성 교육",
        "재발 증상 시 조기 내원",
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
    },
  ],
};
