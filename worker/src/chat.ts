import type { Env, ChatRequest, ChatResponse } from "./types";

// ── Surgery schedule estimation ──

const SURGERY_DURATIONS: Record<string, number> = {
  UBE: 60,
  VP: 60,
  LP: 90,
  ACDF: 90,
  Fusion: 150,
  PPF: 150,
  TLIF: 150,
  OLIF: 150,
  PSF: 150,
};
const TURNOVER_MIN = 60; // minutes between surgeries

function estimateSurgeryTime(schedule?: string, abbreviation?: string): string {
  if (!schedule) return "수술 스케줄 정보 없음";

  const sch = schedule.toUpperCase().trim();
  const duration = abbreviation ? (SURGERY_DURATIONS[abbreviation.toUpperCase()] ?? 90) : 90;

  if (sch === "9A" || sch === "AM1" || sch === "1ST") {
    return `오전 9시 시작 예정 (예상 소요 약 ${duration}분)`;
  }
  if (sch === "AMOC1" || sch === "AM2" || sch === "2ND") {
    // After first AM surgery + turnover
    return `오전 첫 수술 이후 (대략 오전 11시~12시경, 앞 수술 상황에 따라 변동)`;
  }
  if (sch === "AMOC2" || sch === "AM3" || sch === "3RD") {
    return `오전 두 번째 수술 이후 (대략 오후 12시~1시경, 앞 수술 상황에 따라 변동)`;
  }
  if (sch === "PMOC" || sch === "PM1") {
    return `오후 12시 30분~1시 30분경 시작 예정 (예상 소요 약 ${duration}분)`;
  }
  if (sch === "PMOC1" || sch === "PM2") {
    return `오후 첫 수술 이후 (대략 오후 2시 30분~3시 30분경, 앞 수술 상황에 따라 변동)`;
  }
  // Direct time like "9A", "10A", "1P" etc
  const timeMatch = sch.match(/^(\d{1,2})(A|P)$/);
  if (timeMatch) {
    const hour = parseInt(timeMatch[1]);
    const ampm = timeMatch[2] === "A" ? "오전" : "오후";
    return `${ampm} ${hour}시 시작 예정 (예상 소요 약 ${duration}분)`;
  }

  return `스케줄: ${schedule} (예상 소요 약 ${duration}분)`;
}

function buildSystemPrompt(ctx: ChatRequest["patientContext"]): string {
  const scheduleInfo = estimateSurgeryTime(ctx.surgerySchedule, ctx.surgeryAbbreviation);

  return `당신은 SpineTrack AI 상담사입니다. 척추 수술 환자의 회복을 돕는 전문 의료 안내 챗봇입니다.

## 환자 정보
- 이름: ${ctx.name}
- 진단: ${ctx.diagnosis}
- 수술: ${ctx.surgeryType}
- 수술일: ${ctx.surgeryDate}
- 수술 예정 시간: ${scheduleInfo}
- 현재 회복 단계: ${ctx.currentStage}

## 수술 시간 안내 규칙
- 환자가 수술 시간을 물으면, 위의 "수술 예정 시간" 정보를 바탕으로 답변
- 시간은 어디까지나 **예상**이며 실제로는 앞 수술 상황, 환자 상태에 따라 달라질 수 있음을 반드시 안내
- "정확한 시간은 수술 당일 간호사가 안내드릴 예정입니다"라고 추가 안내
- 수술별 예상 소요 시간: UBE 약 1시간, LP/ACDF 약 1시간 30분, 유합술(Fusion/PPF/TLIF/OLIF) 약 2시간 30분

## ERAS (Enhanced Recovery After Surgery) 프로토콜 — 반드시 준수
- **금식**: 맑은 음료는 수술 2시간 전까지, 가벼운 식사는 6시간 전까지 허용 (자정부터 금식 아님)
- **조기 보행**: PACU에서 병동 복귀 즉시 보행 시작 (모든 수술)
- **조기 식이**: 연하 기능 확인 후 즉시 식이 시작
- **통증 관리**: Opioid-sparing 원칙 — 아세트아미노펜 650mg TID + prn NSAIDs. PCA 없음, 마약성 진통제 없음
- **배액관**: 경막이 열린 수술은 삽입하지 않음, 그 외 POD#1 제거
- **도뇨관**: 3시간 이상 수술에만 삽입, PACU에서 즉시 제거
- **PONV 예방**: 수술 직후 5HT3 antagonist IV
- **감염 예방**: Cefazolin 2g 절개 30분 전, Betadine + chlorhexidine, 이중장갑

## Triage 규칙 — 반드시 응답 마지막 줄에 [TRIAGE:레벨] 태그 포함

### RED (즉시 응급) — [TRIAGE:red]
다음 증상이 언급되면 반드시 RED:
- 새로 발생한 마비, 근력 저하, 하지 무력감
- 배뇨/배변 장애 (특히 하반신 감각 이상 동반 시 — 마미증후군 의심)
- 극심한 두통 + 구토 (뇌척수액 누출 의심)
- 흉통, 호흡곤란 (폐색전증 의심)
- 한쪽 종아리의 갑작스러운 부종 (DVT 의심)
- 39도 이상 고열
- 의식 저하, 실신

RED 응답 시 반드시 포함:
1. 증상의 위험성 설명
2. "즉시 응급실에 내원하시거나 119에 연락하세요" 안내
3. 병원 연락처 안내

### YELLOW (의사 확인 권장) — [TRIAGE:yellow]
- 38도 이상 발열
- 새로 생기거나 악화되는 저림/감각 이상
- 수술 부위 분비물 (노란색/녹색/악취)
- 수술 부위 부기 악화 + 열감
- 예상보다 심한 통증 (진통제로 조절 안 됨)

YELLOW 응답 시: "다음 외래 방문 시 또는 전화로 담당 의료진에게 상의하세요" 안내

### GREEN (일반 안내) — [TRIAGE:green]
- 일상 생활 문의 (샤워, 운전, 운동, 식사 등)
- 수술 과정 설명
- 약물 복용 안내
- 재활/운동 안내
- 일반적인 궁금증

## 응답 규칙
1. 한국어로 답변
2. 짧고 명확하게 (2-4문장 권장, 필요시 더 길게)
3. 의학적 근거에 기반하되 환자가 이해하기 쉬운 표현 사용
4. 확실하지 않은 내용은 "담당 의료진에게 확인하세요"로 안내
5. 절대로 직접 진단하거나 처방하지 않음
6. 환자의 현재 회복 단계에 맞는 맥락적 답변
7. 응답의 마지막 줄에 반드시 [TRIAGE:green], [TRIAGE:yellow], 또는 [TRIAGE:red] 중 하나를 포함`;
}

function parseTriageFromResponse(text: string): { content: string; triage: "green" | "yellow" | "red" } {
  // Search anywhere in the text for triage tag
  const triageMatch = text.match(/\[TRIAGE:(green|yellow|red)\]/);
  const triage = (triageMatch?.[1] as "green" | "yellow" | "red") ?? "green";
  // Remove all triage tags from content
  const content = text.replace(/\s*\[TRIAGE:(green|yellow|red)\]\s*/g, " ").trim();
  return { content, triage };
}

export async function handleChat(
  body: ChatRequest,
  env: Env
): Promise<ChatResponse> {
  const systemPrompt = buildSystemPrompt(body.patientContext);

  // Build messages for Workers AI
  const messages: { role: "system" | "user" | "assistant"; content: string }[] = [
    { role: "system", content: systemPrompt },
    ...body.messages.map((msg) => ({
      role: (msg.role === "user" ? "user" : "assistant") as "user" | "assistant",
      content: msg.content,
    })),
  ];

  const result = await env.AI.run("@cf/meta/llama-3.1-8b-instruct", {
    messages,
    max_tokens: 1024,
    temperature: 0.7,
  });

  const rawText = (result as { response?: string }).response;
  if (!rawText) {
    throw new Error("Empty response from Workers AI");
  }

  return parseTriageFromResponse(rawText);
}
