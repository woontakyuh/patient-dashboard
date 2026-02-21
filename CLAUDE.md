# Patient Dashboard - Development Guide

## Project Overview
척추 수술(L4-5 HIVD, UBE discectomy) 환자를 위한 개인 맞춤형 대시보드 웹앱.
Next.js 14 (App Router) + TypeScript + Tailwind CSS.

## Tech Stack
- Next.js 14 (App Router, `src/app`)
- TypeScript
- Tailwind CSS
- Recharts (PROM 차트)
- Playwright (E2E 스크린샷)
- npm (패키지매니저)

## 코드 수정 후 반드시 할 것
1. `npm run build`로 에러 확인
2. Playwright로 전 페이지 스크린샷 캡처: `npx playwright test e2e/screenshots.spec.ts`
3. 스크린샷 검토 후 UI 이슈 자체 수정
4. 수정 사항 CHANGELOG.md에 기록

## Key Routes
- `/patient/[id]` — 메인 대시보드 (입원 타임라인 / 퇴원 후 뷰)
- `/patient/[id]/timeline` — 전체 수술 여정 타임라인
- `/patient/[id]/instructions/[stage]` — 단계별 안내 상세
- `/patient/[id]/prom` — PROM 설문 입력 (VAS, ODI, 만족도)
- `/patient/[id]/progress` — PROM 추이 차트

## Data Architecture
- `src/lib/types.ts` — 핵심 타입 정의 (`Patient`, `ClinicalStage`, `StagePhase`)
- `src/data/mock-patient.ts` — 목업 환자 데이터 (김태수, L4-5 HIVD)
- Stages는 `phase: "inpatient" | "outpatient"`로 구분
- 퇴원 상태는 localStorage(`patient-discharged`)로 관리
- 환자 아바타 사진은 localStorage(`patient-avatar`)로 관리

## Design Conventions
- 메인 컬러: blue-600 (#2563EB)
- 모바일 퍼스트, max-w-5xl 반응형
- 카드 기반 UI: `bg-white rounded-2xl shadow-sm border border-gray-100`
- 상태 색상: completed=green, current=blue+pulse, upcoming=gray
- warnings=amber, dos=green, donts=red
