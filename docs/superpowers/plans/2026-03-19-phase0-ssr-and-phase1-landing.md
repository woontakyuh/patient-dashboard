# Phase 0 (SSR + Middleware) + Phase 1 (Landing Page) Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Convert from static export to SSR, add subdomain middleware routing, restructure into route groups, and build the SpineTrack public landing page.

**Architecture:** Landing page lives at the root `page.tsx` (serves `spinetrack.ai/`). Patient routes stay in a `(patient)` route group (URL-transparent, so `/P001` and `/patient/P001/*` work naturally). Admin uses an actual `/admin/` URL prefix, and middleware rewrites `dashboard.spinetrack.ai/*` → `/admin/*`. Middleware also 301-redirects legacy patient URLs on the main domain to `patient.spinetrack.ai`.

**Tech Stack:** Next.js 14 (SSR), framer-motion (scroll animations), Tailwind CSS, TypeScript

---

## Routing Strategy (Revised)

Route groups are URL-transparent in Next.js — you CANNOT rewrite to `/(group)/path`. The correct approach:

```
src/app/
├── layout.tsx                  ← Bare root (html/body/fonts only)
├── page.tsx                    ← Landing page (spinetrack.ai/)
├── components/landing/         ← Landing page components
├── (patient)/                  ← Route group (URL-transparent)
│   ├── layout.tsx              ← AppHeader + BottomNav + max-w-480
│   ├── [id]/                   ← /P001 (short URL)
│   ├── patient/[id]/           ← /patient/P001/* (full URL)
│   └── qr/[id]/               ← /qr/P001
└── admin/                      ← Actual URL prefix /admin/*
    ├── layout.tsx              ← Admin layout (desktop, sidebar)
    └── page.tsx                ← Admin home
```

Middleware logic:
```
1. dashboard.spinetrack.ai/*   → rewrite to /admin/*
2. spinetrack.ai/[patient-id]  → 301 redirect to patient.spinetrack.ai/[id]
3. spinetrack.ai/patient/*     → 301 redirect to patient.spinetrack.ai/patient/*
4. spinetrack.ai/qr/*          → 301 redirect to patient.spinetrack.ai/qr/*
5. localhost (dev)             → no redirects, all routes accessible
6. Everything else             → pass through
```

---

## File Structure

### New Files
| File | Responsibility |
|------|---------------|
| `src/middleware.ts` | Subdomain routing + legacy redirects |
| `src/app/page.tsx` | Landing page (replaces old redirect) |
| `src/app/components/landing/LandingHeader.tsx` | Landing header/nav |
| `src/app/components/landing/HeroSection.tsx` | Hero with animations |
| `src/app/components/landing/FeaturesSection.tsx` | Feature cards |
| `src/app/components/landing/HowItWorksSection.tsx` | Step-by-step journey |
| `src/app/components/landing/ForWhomSection.tsx` | For patients / doctors |
| `src/app/components/landing/FooterSection.tsx` | Footer |
| `src/app/(patient)/layout.tsx` | Patient layout (from root layout) |
| `src/app/admin/layout.tsx` | Admin layout placeholder |
| `src/app/admin/page.tsx` | Admin placeholder |

### Modified Files
| File | Change |
|------|--------|
| `next.config.mjs` | Remove `output: "export"` |
| `src/app/layout.tsx` | Strip to bare html/body + fonts only |
| `src/app/(patient)/[id]/page.tsx` | Fix import path after move |
| `package.json` | Add `framer-motion` |

### Moved Files
| From | To | Notes |
|------|----|-------|
| `src/app/[id]/` | `src/app/(patient)/[id]/` | Update import in page.tsx |
| `src/app/patient/` | `src/app/(patient)/patient/` | |
| `src/app/qr/` | `src/app/(patient)/qr/` | |

### Deleted Files
| File | Reason |
|------|--------|
| `src/app/page.tsx` (old) | Was redirect to /P004, replaced by landing page |

---

## Task 1: SSR Conversion

**Files:**
- Modify: `next.config.mjs`

- [ ] **Step 1: Remove static export config**

```js
// next.config.mjs
/** @type {import('next').NextConfig} */
const nextConfig = {};

export default nextConfig;
```

- [ ] **Step 2: Verify build works**

Run: `npm run build`
Expected: Build succeeds. May show warnings about generateStaticParams — that's OK.

- [ ] **Step 3: Commit**

```bash
git add next.config.mjs
git commit -m "chore: remove static export for SSR migration"
```

---

## Task 2: Route Group Restructuring

**Files:**
- Move: `src/app/[id]/` → `src/app/(patient)/[id]/`
- Move: `src/app/patient/` → `src/app/(patient)/patient/`
- Move: `src/app/qr/` → `src/app/(patient)/qr/`
- Fix: `src/app/(patient)/[id]/page.tsx` import path
- Modify: `src/app/layout.tsx` (strip to bare)
- Create: `src/app/(patient)/layout.tsx`
- Delete: `src/app/page.tsx` (old redirect)

- [ ] **Step 1: Create (patient) route group and move files**

```bash
mkdir -p src/app/\(patient\)
mv src/app/\[id\] src/app/\(patient\)/
mv src/app/patient src/app/\(patient\)/
mv src/app/qr src/app/\(patient\)/
```

- [ ] **Step 2: Fix import in (patient)/[id]/page.tsx**

The moved file imports from `@/app/patient/[id]/PageClient`. After the move, this becomes `@/app/(patient)/patient/[id]/PageClient`:

```tsx
// src/app/(patient)/[id]/page.tsx
import PageClient from "@/app/(patient)/patient/[id]/PageClient";
import { getAllPatientIds } from "@/data/mock-patient";

export function generateStaticParams() {
  return getAllPatientIds().map((id) => ({ id }));
}

export default function ShortPatientPage({
  params,
}: {
  params: { id: string };
}) {
  return <PageClient id={params.id} />;
}
```

- [ ] **Step 3: Create patient layout**

Create `src/app/(patient)/layout.tsx`. Pull the UI wrapper from the current root layout (AppHeader, BottomNav, max-w-480). Keep existing `PatientAccessGate` wrappers in `[id]/layout.tsx` and `patient/[id]/layout.tsx` as-is — they handle auth and are preserved by the move.

```tsx
// src/app/(patient)/layout.tsx
import AppHeader from "@/components/AppHeader";
import BottomNav from "@/components/BottomNav";

export default function PatientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      <AppHeader />
      <main className="mx-auto w-full max-w-[480px] flex-1 px-4 pb-24 pt-4">
        {children}
      </main>
      <BottomNav />
    </div>
  );
}
```

- [ ] **Step 4: Strip root layout to bare essentials**

Modify `src/app/layout.tsx` — keep only html, body, fonts, globals.css. Remove AppHeader, BottomNav, max-w-480, bg-gray-50:

```tsx
import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "SpineTrack",
  description: "척추 수술 환자를 위한 맞춤형 회복 가이드",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
```

- [ ] **Step 5: Replace old home page with landing placeholder**

Delete old `src/app/page.tsx` (redirect to /P004) and create new one:

```tsx
// src/app/page.tsx
export default function LandingPage() {
  return <div>SpineTrack Landing — Coming Soon</div>;
}
```

- [ ] **Step 6: Create admin placeholder**

```bash
mkdir -p src/app/admin
```

Create `src/app/admin/layout.tsx`:
```tsx
export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="min-h-screen bg-gray-50">{children}</div>;
}
```

Create `src/app/admin/page.tsx`:
```tsx
export default function AdminPage() {
  return <div>SpineTrack Admin — Coming Soon</div>;
}
```

- [ ] **Step 7: Verify build**

Run: `npm run build`
Expected: Build succeeds. Patient routes under `(patient)` still accessible at same URLs.

- [ ] **Step 8: Verify patient routes still work**

Run: `npm run dev`
- `http://localhost:3000` → "SpineTrack Landing — Coming Soon"
- `http://localhost:3000/P004` → Patient dashboard (should work, route group is URL-transparent)
- `http://localhost:3000/patient/P004` → Patient dashboard (full URL)
- `http://localhost:3000/admin` → "SpineTrack Admin — Coming Soon"

- [ ] **Step 9: Commit**

```bash
git add -A
git commit -m "refactor: restructure app into (patient) route group + admin path + landing root"
```

---

## Task 3: Subdomain Middleware

**Files:**
- Create: `src/middleware.ts`

- [ ] **Step 1: Create middleware**

```ts
// src/middleware.ts
import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const host = request.headers.get("host") || "";
  const hostname = host.split(":")[0]; // strip port for local dev
  const { pathname, search } = request.nextUrl;

  // Local dev: no subdomain routing (all routes accessible on localhost)
  if (hostname === "localhost" || hostname === "127.0.0.1") {
    return NextResponse.next();
  }

  // Dashboard subdomain → rewrite to /admin/*
  if (hostname.startsWith("dashboard.")) {
    const url = request.nextUrl.clone();
    url.pathname = `/admin${pathname}`;
    return NextResponse.rewrite(url);
  }

  // Patient subdomain → pass through (route group handles it)
  if (hostname.startsWith("patient.")) {
    return NextResponse.next();
  }

  // Main domain (spinetrack.ai, www.spinetrack.ai)
  // Redirect legacy patient paths to patient subdomain
  const patientIdMatch = pathname.match(/^\/([A-Z]?\d{3,})(\/.*)?$/);
  if (patientIdMatch) {
    return NextResponse.redirect(
      `https://patient.spinetrack.ai${pathname}${search}`,
      301
    );
  }

  // Redirect /patient/* paths to patient subdomain
  if (pathname.startsWith("/patient/")) {
    return NextResponse.redirect(
      `https://patient.spinetrack.ai${pathname}${search}`,
      301
    );
  }

  // Redirect /qr/* paths to patient subdomain
  if (pathname.startsWith("/qr/")) {
    return NextResponse.redirect(
      `https://patient.spinetrack.ai${pathname}${search}`,
      301
    );
  }

  // Block /admin/* on main domain
  if (pathname.startsWith("/admin")) {
    return NextResponse.redirect("https://dashboard.spinetrack.ai/", 302);
  }

  // Main domain: serve landing page (root page.tsx)
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|fonts|api).*)",
  ],
};
```

- [ ] **Step 2: Verify build**

Run: `npm run build`
Expected: Build succeeds with middleware.

- [ ] **Step 3: Commit**

```bash
git add src/middleware.ts
git commit -m "feat: add subdomain routing middleware with legacy redirects"
```

---

## Task 4: Install framer-motion

**Files:**
- Modify: `package.json`

- [ ] **Step 1: Install**

```bash
npm install framer-motion
```

- [ ] **Step 2: Commit**

```bash
git add package.json package-lock.json
git commit -m "chore: add framer-motion for landing page animations"
```

---

## Task 5: Landing Page Header + Footer

**Files:**
- Create: `src/app/components/landing/LandingHeader.tsx`
- Create: `src/app/components/landing/FooterSection.tsx`

- [ ] **Step 1: Create components directory**

```bash
mkdir -p src/app/components/landing
```

- [ ] **Step 2: Create LandingHeader**

A sticky transparent header that gains a white background on scroll. Links to #features, #how-it-works anchors and dashboard login.

See full code: client component with scroll detection via `useEffect`, conditional `bg-white/90 backdrop-blur-md` styling, SpineTrack logo SVG (spine icon), navigation links.

- [ ] **Step 3: Create FooterSection**

Simple footer with SpineTrack logo and copyright.

- [ ] **Step 4: Update landing page to use header/footer**

Wrap the landing page content between header and footer. Import in `src/app/page.tsx`:

```tsx
import LandingHeader from "./components/landing/LandingHeader";
import FooterSection from "./components/landing/FooterSection";

export default function LandingPage() {
  return (
    <>
      <LandingHeader />
      <main>
        <p>Coming soon...</p>
      </main>
      <FooterSection />
    </>
  );
}
```

- [ ] **Step 5: Build + verify**

Run: `npm run build`

- [ ] **Step 6: Commit**

```bash
git add src/app/components/landing/ src/app/page.tsx
git commit -m "feat: add landing page header and footer"
```

---

## Task 6: Hero Section

**Files:**
- Create: `src/app/components/landing/HeroSection.tsx`
- Modify: `src/app/page.tsx`

- [ ] **Step 1: Create HeroSection**

Full-viewport hero with blue-to-indigo gradient, animated spine-like dots, fade-in text, CTAs ("자세히 알아보기" + "의료진 로그인"), scroll indicator.

Uses `framer-motion`: `motion.div` with `initial`/`animate` for entrance, `whileInView` not needed (always visible). Animated background blobs with `blur-3xl`. Spine vertebrae dots with staggered `delay`.

- [ ] **Step 2: Add to landing page**

Replace placeholder in `src/app/page.tsx`.

- [ ] **Step 3: Build + visual check**

Run: `npm run dev`, open `http://localhost:3000`
Expected: Full-screen hero with gradient, animated text, scroll indicator.

- [ ] **Step 4: Commit**

```bash
git add src/app/components/landing/HeroSection.tsx src/app/page.tsx
git commit -m "feat: add landing page hero section with animations"
```

---

## Task 7: Features Section

**Files:**
- Create: `src/app/components/landing/FeaturesSection.tsx`
- Modify: `src/app/page.tsx`

- [ ] **Step 1: Create FeaturesSection**

6 feature cards in a responsive grid (1→2→3 cols). Each card: icon (lucide-react, already installed), title, description. Scroll-triggered fade-in with staggered delay using `whileInView`.

Features: 수술 여정 타임라인, 맞춤 회복 설문 (PROM), 회복 추이 차트, 단계별 교육 콘텐츠, AI 건강 상담, 오늘의 할 일.

- [ ] **Step 2: Add to landing page after Hero**

- [ ] **Step 3: Build + verify**

- [ ] **Step 4: Commit**

```bash
git add src/app/components/landing/FeaturesSection.tsx src/app/page.tsx
git commit -m "feat: add landing page features section"
```

---

## Task 8: How It Works Section

**Files:**
- Create: `src/app/components/landing/HowItWorksSection.tsx`
- Modify: `src/app/page.tsx`

- [ ] **Step 1: Create HowItWorksSection**

4 numbered steps with alternating left/right slide-in animation: QR 코드 스캔 → 매일 회복 체크 → 회복 추이 확인 → 궁금한 건 AI에게. Each step: number badge, title, description, detail tag.

- [ ] **Step 2: Add to landing page after Features**

- [ ] **Step 3: Build + verify**

- [ ] **Step 4: Commit**

```bash
git add src/app/components/landing/HowItWorksSection.tsx src/app/page.tsx
git commit -m "feat: add landing page how-it-works section"
```

---

## Task 9: For Whom Section

**Files:**
- Create: `src/app/components/landing/ForWhomSection.tsx`
- Modify: `src/app/page.tsx`

- [ ] **Step 1: Create ForWhomSection**

Two side-by-side cards: "환자분께" (blue gradient bg, User icon) and "의료진께" (green gradient bg, Stethoscope icon). Each with 4 bullet points describing value proposition. Slide-in animations.

- [ ] **Step 2: Add to landing page after How It Works**

- [ ] **Step 3: Build + verify**

- [ ] **Step 4: Commit**

```bash
git add src/app/components/landing/ForWhomSection.tsx src/app/page.tsx
git commit -m "feat: add landing page for-whom section"
```

---

## Task 10: Final Assembly + Playwright Screenshots

**Files:**
- Modify: `src/app/page.tsx` (verify final assembly)
- Modify: `e2e/screenshots.spec.ts` (add landing page, fix patient paths)
- Modify: `CHANGELOG.md`

- [ ] **Step 1: Verify final landing page has all sections**

`src/app/page.tsx` should render in order:
1. LandingHeader (sticky)
2. HeroSection
3. FeaturesSection
4. HowItWorksSection
5. ForWhomSection
6. FooterSection

- [ ] **Step 2: Build check**

Run: `npm run build`
Expected: Clean build, no errors.

- [ ] **Step 3: Update Playwright test for landing page**

Add a landing page screenshot test. For patient route tests on localhost, they should still work at `/P004` and `/patient/P004/*` since middleware passes through on localhost.

- [ ] **Step 4: Run Playwright screenshots**

Run: `npx playwright test e2e/screenshots.spec.ts`
Review screenshots for visual issues. Fix any problems found.

- [ ] **Step 5: Update CHANGELOG.md**

```markdown
## [Unreleased]
### Added
- SSR 전환 (정적 빌드 → 서버 사이드 렌더링)
- 서브도메인 미들웨어 라우팅 (spinetrack.ai / patient / dashboard)
- Route Group 구조 분리 — (patient) route group + /admin/ path
- SpineTrack 공개 랜딩 페이지 (Hero, Features, How It Works, For Whom)
- 기존 환자 URL 301 리다이렉트 (spinetrack.ai/[id] → patient.spinetrack.ai/[id])
```

- [ ] **Step 6: Final commit**

```bash
git add -A
git commit -m "feat: complete Phase 0 (SSR + middleware) + Phase 1 (landing page)"
```
