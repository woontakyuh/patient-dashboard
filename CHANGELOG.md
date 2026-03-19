# Changelog

## [Unreleased]

### Added
- SSR 전환 (정적 빌드 → 서버 사이드 렌더링)
- 서브도메인 미들웨어 라우팅 (spinetrack.ai / patient / dashboard)
- Route Group 구조 분리 — (patient) route group + /admin/ path
- SpineTrack 공개 랜딩 페이지 (Hero, Features, How It Works, For Whom)
- 기존 환자 URL 301 리다이렉트 (spinetrack.ai/[id] → patient.spinetrack.ai/[id])
- 관리자 대시보드 MVP (dashboard.spinetrack.ai)
  - 비밀번호 기반 로그인 (httpOnly cookie, 30일 세션)
  - 환자 목록 + 이름 검색 (Notion DB 연동)
  - PROM 응답 현황 뱃지 (Pre/1M/3M/6M/1Y)
  - 개별 환자 PROM 추이 차트 (VAS, ODI/NDI, JOA, EQ-VAS)
  - 한국형 EQ-5D-5L 유틸리티 계산 (Kim et al. 2016)
  - 다크 테마 사이드바 레이아웃
