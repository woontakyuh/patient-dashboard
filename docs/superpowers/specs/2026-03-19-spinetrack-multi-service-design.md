# SpineTrack Multi-Service Architecture Design

## Overview

SpineTrack을 3개 서비스로 확장하는 설계 문서.
단일 Next.js 프로젝트에서 서브도메인 기반으로 3개 서비스를 제공한다.

## Domain Structure

| Domain | Service | Description |
|--------|---------|-------------|
| `spinetrack.ai` | Landing | 공개 랜딩 페이지 — SpineTrack 서비스 소개 |
| `patient.spinetrack.ai/[id]` | Patient Dashboard | 개별 환자 대시보드 (기존 기능 이전) |
| `dashboard.spinetrack.ai` | Admin Dashboard | 의료진 관리 대시보드 (로그인 필요) |

## Architecture Decisions

### 1. Single Project (Monolith)
3개 서비스를 현재 `patient-dashboard` 프로젝트 하나에서 관리한다.
- 타입, 유틸, 컴포넌트 공유 용이
- 배포/관리 포인트 단일화
- 규모가 커지면 추후 분리 가능

### 2. SSR 전환
`output: "export"` (정적 빌드) → SSR로 전환한다.
- Next.js middleware로 서브도메인별 라우트 분기
- 관리자 대시보드: 서버 사이드 세션 관리 (로그인)
- 관리자 대시보드: Notion API 서버에서 직접 호출
- **환자 대시보드: 기존 클라이언트 컴포넌트 유지** (localStorage 인증 그대로)

### 3. Data Access Pattern — Cloudflare Worker 퇴역
기존 `takmd-gateway` Worker의 3가지 역할을 정리한다:

| 기존 역할 | 이전 방향 |
|-----------|----------|
| API 처리 (`/api/patient`, `/api/prom`, `/api/chat`) | Next.js API Route로 이전 |
| 정적 파일 프록시 (Pages → index.html) | Vercel SSR이 처리 → 삭제 |
| SPA 폴백 (404 → index.html) | Vercel SSR이 처리 → 삭제 |

- **환자 대시보드 + 관리자 대시보드** 모두 Next.js API Route에서 Notion API 직접 호출
- Worker의 Notion 호출 코드(`worker/src/notion.ts`)를 `src/lib/notion/` 으로 이전
- 챗봇은 Cloudflare Workers AI → `@ai-sdk/anthropic` (Claude API)로 교체
- KV 캐시 → Next.js `unstable_cache` 또는 Vercel KV로 대체

### 3a. takmd.com 하위호환 (Worker 축소)
기존 QR코드가 `[환자번호].takmd.com` 형태로 배포되어 있으므로 Worker를 완전 삭제하지 않고 **리다이렉트 전용으로 축소**:
```
[ptNo].takmd.com/* → 301 redirect → patient.spinetrack.ai/[ptNo]/*
```
- Worker 코드를 API/프록시 로직 모두 제거, 리다이렉트 한 줄로 축소
- 모든 QR코드가 `patient.spinetrack.ai`로 교체되면 Worker 완전 퇴역

### 4. Data Layer
- **환자 데이터 / PROM**: 기존 Notion DB 그대로 활용
- **연속 PROM 데이터**: 기존 고정 timepoint 칼럼 외에 별도 PROM submissions DB 필요 (Phase 3에서 설계)
- **접속 로그 / 챗 기록**: Phase 4에서 Cloudflare D1 추가 예정

### 5. Route Group Layout 분리
3개 서비스는 완전히 다른 UI가 필요하므로 Route Group으로 레이아웃 분리:
```
src/app/
├── (landing)/          ← 풀폭, 마케팅 헤더, 스크롤 애니메이션
│   └── layout.tsx
├── (patient)/          ← 모바일 퍼스트 max-w-[480px], AppHeader, BottomNav
│   └── layout.tsx
└── (admin)/            ← 데스크톱 퍼스트, 사이드바, 로그인 게이트
    └── layout.tsx
```

## Service 1: Landing Page (`spinetrack.ai`)

### Purpose
SpineTrack이 뭔지, 누구를 위한 건지 소개하는 공개 페이지.

### Design Direction
- 인터랙티브, 모던 디자인 (스크롤 애니메이션, 히어로 섹션)
- 모바일 반응형
- frontend-design 스킬 활용

### Sections (Planned)
1. **Hero** — SpineTrack 한 줄 소개 + 시각적 임팩트
2. **What is SpineTrack** — 서비스 설명
3. **How it works** — 환자 여정 단계별 설명
4. **Features** — 주요 기능 하이라이트 (타임라인, PROM, AI 챗봇, 교육)
5. **For Patients / For Doctors** — 대상별 가치 제안
6. **Footer** — 연락처, 링크

## Service 2: Patient Dashboard (`patient.spinetrack.ai`)

### Migration
- 기존 `spinetrack.ai/[id]` → `patient.spinetrack.ai/[id]`
- 기능 변경 없음, 도메인만 이동
- 기존 생년월일 인증 유지 (localStorage 기반, 클라이언트 컴포넌트 그대로)
- API 통신: Next.js API Route로 이전 (Worker 퇴역)

### URL Redirect (필수)
- `spinetrack.ai/[id]` 접근 시 `patient.spinetrack.ai/[id]`로 **301 리다이렉트**
- 기존 QR코드 하위 호환성 보장
- middleware에서 처리: 메인 도메인의 `[id]` 패턴 감지 → 리다이렉트

### Routes (unchanged)
- `/[id]` — 메인 대시보드
- `/[id]/timeline` — 타임라인
- `/[id]/instructions/[stage]` — 단계별 안내
- `/[id]/prom` — PROM 설문
- `/[id]/progress` — PROM 추이
- `/[id]/education` — 교육
- `/[id]/chat` — AI 챗봇

## Service 3: Admin Dashboard (`dashboard.spinetrack.ai`)

### Authentication
- **Phase 1 (MVP)**: 단일 비밀번호 방식 (spinoscopy-dashboard 참조)
- **Phase 2**: NextAuth.js 기반 사용자별 인증

### Features

#### MVP (Phase 3)
| Feature | Description | Data Source |
|---------|-------------|-------------|
| **A. 환자 목록** | 등록 환자 리스트, 기본 정보 | Notion Patient DB |
| **B. PROM 응답 현황** | 제출/미제출 현황, 응답률 | Notion Patient DB |
| **C. 개별 PROM 차트** | 시간순 연속 시각화 (모든 PROM 시점 표시) | Notion Patient DB (+ PROM submissions DB) |

#### Phase 4
| Feature | Description | Data Source |
|---------|-------------|-------------|
| **D. 집단 Outcome 분석** | 다차원 필터 + 그룹 비교 차트 (spinoscopy-dashboard AnalyticsView 방식) | Notion Patient DB |
| **E. 접속 로그** | 환자별 접속 빈도, 마지막 접속 | Cloudflare D1 |
| **F. 챗봇 질문 관리** | 의료진 답변, 트리아지 알림, FAQ 패턴 분석 | Cloudflare D1 |

### PROM Chart Design (Feature C)
기존 spinoscopy-dashboard의 PromChart를 기반으로 하되:
- 고정 timepoint (pre, 1mo, 3mo...) 대신 **실제 제출 날짜 기반 시간축**
- micro-PROM 스케줄에 따라 더 빈번한 데이터 포인트
- X축: 수술일 기준 경과 일수 또는 실제 날짜
- Y축: VAS, ODI, NDI, JOA, EQ-5D (멀티 차트)
- 테마: 관리자 대시보드 디자인 언어에 맞게 리스타일 (spinoscopy-dashboard 다크 테마 → 새 테마)

### Chatbot Management Design (Feature F)
1. **질문 목록 + 의료진 답변**: 환자별/시간순 질문 열람, 답변 작성
2. **트리아지 기반 정렬**: 빨강(응급) → 노랑(확인 필요) → 초록(일반) 우선순위
3. **FAQ 패턴 분석**: 자주 묻는 질문 자동 그룹화, 빈도 통계

## Infrastructure

### Subdomain Routing (Next.js Middleware)
```
Request → middleware.ts
  ├── host = "spinetrack.ai"
  │     ├── path matches /[patient-id pattern] → 301 redirect to patient.spinetrack.ai/[id]
  │     └── else → /(landing)/*
  ├── host = "patient.spinetrack.ai"   → /(patient)/*
  └── host = "dashboard.spinetrack.ai" → /(admin)/*
```

### Local Development
- `localhost:3000` → 기본 랜딩 페이지
- 서브도메인 테스트: `/etc/hosts`에 `127.0.0.1 patient.localhost dashboard.localhost` 추가
- 또는 middleware에서 `?service=patient` 쿼리 파라미터로 오버라이드 지원

### DNS (Cloudflare)
- `@` A record → Vercel (기존)
- `patient` CNAME → `cname.vercel-dns.com`
- `dashboard` CNAME → `cname.vercel-dns.com`
- Vercel에서 3개 도메인 모두 추가

### Vercel Configuration
- `output: "export"` 제거 → SSR 모드
- 환경변수: `NOTION_API_KEY`, `NOTION_DATABASE_ID`, `DASHBOARD_PASSWORD`, `ANTHROPIC_API_KEY`

### Cloudflare Worker (takmd-gateway) — 축소
- API/프록시 로직 전부 제거
- `[ptNo].takmd.com` → `patient.spinetrack.ai/[ptNo]` 301 리다이렉트만 유지
- QR코드 전량 교체 후 완전 퇴역

## Implementation Order

1. **Phase 0**: SSR 전환 + 미들웨어 서브도메인 라우팅 + Route Group 레이아웃 분리 + 기존 URL 리다이렉트
2. **Phase 1**: 랜딩 페이지 (spinetrack.ai)
3. **Phase 2**: 환자 대시보드 도메인 이전 (patient.spinetrack.ai)
4. **Phase 3**: 관리자 대시보드 MVP — A, B, C + 로그인
5. **Phase 4**: 관리자 대시보드 확장 — D, E, F + D1 연동
