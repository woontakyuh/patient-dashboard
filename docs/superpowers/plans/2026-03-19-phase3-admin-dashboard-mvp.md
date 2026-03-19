# Phase 3: Admin Dashboard MVP Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a medical staff dashboard at `dashboard.spinetrack.ai` with login, patient list, PROM response status, and individual PROM charts.

**Architecture:** Next.js API Routes call Notion API directly (reusing spinoscopy-dashboard patterns). Password-based auth via httpOnly cookie. Admin pages live under `src/app/admin/` (actual URL prefix, middleware rewrites `dashboard.spinetrack.ai/*` → `/admin/*`). Dark theme (zinc-950) matching spinoscopy-dashboard.

**Tech Stack:** Next.js 14 SSR, Notion API, Recharts, Tailwind CSS, TypeScript

**Reference Project:** `/Users/TakMD/workspace/spinoscopy-dashboard` (Clinicus agent)

---

## File Structure

### New Files
| File | Responsibility |
|------|---------------|
| `src/lib/notion/client.ts` | Notion API wrapper (server-side) |
| `src/lib/notion/patients.ts` | Patient search + PROM data fetching |
| `src/lib/prom/calculator.ts` | PROM score parsing (VAS, ODI, NDI, JOA, EQ-5D) |
| `src/lib/types/admin.ts` | Admin dashboard type definitions |
| `src/app/api/auth/login/route.ts` | Login endpoint (set httpOnly cookie) |
| `src/app/api/auth/logout/route.ts` | Logout endpoint (clear cookie) |
| `src/app/api/admin/patients/route.ts` | Patient list + search API |
| `src/app/api/admin/patients/[pageId]/route.ts` | Individual patient PROM data |
| `src/app/admin/login/page.tsx` | Login page |
| `src/app/admin/page.tsx` | Main dashboard (patient list + PROM status) |
| `src/app/admin/patients/[pageId]/page.tsx` | Individual patient PROM chart view |
| `src/app/admin/components/AdminSidebar.tsx` | Sidebar navigation |
| `src/app/admin/components/PatientTable.tsx` | Patient list with PROM status |
| `src/app/admin/components/PromChart.tsx` | Individual PROM time-series chart |
| `src/app/admin/components/PromStatusBadge.tsx` | PROM completion badge |

### Modified Files
| File | Change |
|------|--------|
| `src/middleware.ts` | Add auth check for `/admin/*` (except `/admin/login`) |
| `src/app/admin/layout.tsx` | Add dark theme + sidebar layout |
| `package.json` | Add `@tanstack/react-query` |
| `.env.local` | Add `NOTION_TOKEN`, `NOTION_PATIENT_DB_ID`, `ADMIN_PASSWORD` |

---

## Task 1: Environment & Dependencies

**Files:**
- Modify: `package.json`
- Create: `.env.local` (manual, not committed)

- [ ] **Step 1: Install @tanstack/react-query**

```bash
npm install @tanstack/react-query
```

- [ ] **Step 2: Create .env.local**

Create `.env.local` at project root (NOT committed to git):
```
NOTION_TOKEN=<copy from spinoscopy-dashboard/.env.local>
NOTION_PATIENT_DB_ID=<copy from spinoscopy-dashboard/.env.local>
ADMIN_PASSWORD=spinetrack2026
```

Verify: the NOTION_TOKEN and NOTION_PATIENT_DB_ID should match what spinoscopy-dashboard uses.

- [ ] **Step 3: Commit**

```bash
git add package.json package-lock.json
git commit -m "chore: add @tanstack/react-query for admin dashboard"
```

---

## Task 2: Type Definitions

**Files:**
- Create: `src/lib/types/admin.ts`

- [ ] **Step 1: Create admin types**

Reference: `spinoscopy-dashboard/lib/types/patient.ts` and `spinoscopy-dashboard/lib/notion/analytics.ts`

```ts
// src/lib/types/admin.ts

export interface PatientRow {
  pageId: string;
  name: string;
  ptNo: string;
  age: number;
  sex: "M" | "F";
  hospital: string;
  surgeon: string;
  opDate: string;
  opName: string;
  opCategory: string[];
  classA: string[];
  classB: string[];
  promStatus: PromStatus;
}

export interface PromStatus {
  pre: boolean;
  "1mo": boolean;
  "3mo": boolean;
  "6mo": boolean;
  "1y": boolean;
}

export type Timepoint = "pre" | "1mo" | "3mo" | "6mo" | "1y";

export interface ParsedProm {
  vasProx: number | null;
  vasDist: number | null;
  odiPercent: number | null;
  ndiPercent: number | null;
  joaScore: number | null;
  eq5dUtility: number | null;
  eqVas: number | null;
}

export type PromRecord = Partial<Record<Timepoint, ParsedProm>>;

export interface PatientDetail {
  pageId: string;
  name: string;
  ptNo: string;
  age: number;
  sex: "M" | "F";
  opDate: string;
  opName: string;
  hospital: string;
  surgeon: string;
  region: "cervical" | "lumbar" | "unknown";
  prom: PromRecord;
}
```

- [ ] **Step 2: Commit**

```bash
git add src/lib/types/admin.ts
git commit -m "feat: add admin dashboard type definitions"
```

---

## Task 3: PROM Score Parser

**Files:**
- Create: `src/lib/prom/calculator.ts`

- [ ] **Step 1: Create PROM parser**

Port from `spinoscopy-dashboard/lib/prom/calculator.ts`. Key functions:

```ts
// src/lib/prom/calculator.ts

import type { ParsedProm, Timepoint } from "@/lib/types/admin";

/** Parse VAS string "3/2" or "3" → { prox, dist } */
export function parseVAS(str: string): { prox: number | null; dist: number | null } {
  if (!str) return { prox: null, dist: null };
  const parts = str.split("/");
  return {
    prox: parseFloat(parts[0]) || null,
    dist: parts.length > 1 ? parseFloat(parts[1]) || null : null,
  };
}

/** Parse ODI string "22/50" or "44" → percent (0-100) */
export function parseODI(str: string): number | null {
  if (!str) return null;
  const parts = str.split("/");
  if (parts.length === 2) {
    const raw = parseFloat(parts[0]);
    const max = parseFloat(parts[1]);
    return max > 0 ? Math.round((raw / max) * 100) : null;
  }
  const val = parseFloat(str);
  return isNaN(val) ? null : val;
}

/** Parse NDI string "22/50" → percent (0-100) */
export function parseNDI(str: string): number | null {
  return parseODI(str); // same format
}

/** Parse JOA string "14" → number */
export function parseJOA(str: string): number | null {
  if (!str) return null;
  const val = parseFloat(str);
  return isNaN(val) ? null : val;
}

/** Parse EQ5D string "11131/75" → { utility, vas } */
export function parseEQ5D(str: string): { utility: number | null; vas: number | null } {
  if (!str) return { utility: null, vas: null };
  const parts = str.split("/");
  const vas = parts.length > 1 ? parseFloat(parts[1]) || null : null;
  // Simplified: return VAS only for now (utility calculation requires Korean value set)
  return { utility: null, vas };
}

/** Infer region from which PROM instruments have data */
export function inferRegion(
  promData: Record<string, string>
): "cervical" | "lumbar" | "unknown" {
  const hasODI = Object.keys(promData).some(
    (k) => k.includes("ODI") && promData[k]
  );
  const hasNDI = Object.keys(promData).some(
    (k) => k.includes("NDI") && promData[k]
  );
  if (hasNDI) return "cervical";
  if (hasODI) return "lumbar";
  return "unknown";
}

const TIMEPOINTS: Timepoint[] = ["pre", "1mo", "3mo", "6mo", "1y"];
const PROM_KEYS = ["VAS", "ODI", "NDI", "JOA", "EQ5D"];

/** Extract all PROM data from Notion page properties */
export function extractPromRecord(
  properties: Record<string, any>
): { prom: Record<Timepoint, ParsedProm>; promStatus: Record<Timepoint, boolean> } {
  const prom: Record<string, ParsedProm> = {};
  const promStatus: Record<string, boolean> = {};

  for (const tp of TIMEPOINTS) {
    const vasStr = getRichText(properties, `${tp} VAS`);
    const odiStr = getRichText(properties, `${tp} ODI`);
    const ndiStr = getRichText(properties, `${tp} NDI`);
    const joaStr = getRichText(properties, `${tp} JOA`);
    const eq5dStr = getRichText(properties, `${tp} EQ5D`);

    const vas = parseVAS(vasStr);

    prom[tp] = {
      vasProx: vas.prox,
      vasDist: vas.dist,
      odiPercent: parseODI(odiStr),
      ndiPercent: parseNDI(ndiStr),
      joaScore: parseJOA(joaStr),
      eq5dUtility: parseEQ5D(eq5dStr).utility,
      eqVas: parseEQ5D(eq5dStr).vas,
    };

    // Has any PROM data for this timepoint?
    promStatus[tp] = !!(vasStr || odiStr || ndiStr || joaStr || eq5dStr);
  }

  return { prom: prom as Record<Timepoint, ParsedProm>, promStatus: promStatus as Record<Timepoint, boolean> };
}

/** Helper: extract rich_text string from Notion property */
function getRichText(properties: Record<string, any>, key: string): string {
  const p = properties[key];
  if (!p || !p.rich_text || p.rich_text.length === 0) return "";
  return p.rich_text[0].plain_text || "";
}
```

- [ ] **Step 2: Commit**

```bash
git add src/lib/prom/calculator.ts
git commit -m "feat: add PROM score parser for admin dashboard"
```

---

## Task 4: Notion Client & Patient Queries

**Files:**
- Create: `src/lib/notion/client.ts`
- Create: `src/lib/notion/patients.ts`

- [ ] **Step 1: Create Notion client wrapper**

Reference: `spinoscopy-dashboard/lib/notion/client.ts`

```ts
// src/lib/notion/client.ts

const NOTION_VERSION = "2022-06-28";

export async function notionRequest<T>(
  path: string,
  options: { method?: string; body?: unknown } = {}
): Promise<T> {
  const token = process.env.NOTION_TOKEN;
  if (!token) throw new Error("NOTION_TOKEN not set");

  const res = await fetch(`https://api.notion.com/v1${path}`, {
    method: options.method || "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Notion-Version": NOTION_VERSION,
      "Content-Type": "application/json",
    },
    body: options.body ? JSON.stringify(options.body) : undefined,
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Notion API ${res.status}: ${text}`);
  }

  return res.json() as Promise<T>;
}
```

- [ ] **Step 2: Create patient query functions**

Reference: `spinoscopy-dashboard/lib/notion/patients.ts` + `lib/notion/analytics.ts`

```ts
// src/lib/notion/patients.ts

import { notionRequest } from "./client";
import { extractPromRecord, inferRegion, getRichText } from "@/lib/prom/calculator";
import type { PatientRow, PatientDetail } from "@/lib/types/admin";

const DB_ID = () => process.env.NOTION_PATIENT_DB_ID!;

/** Notion property helpers */
function getTitle(page: any, prop: string): string {
  const p = page.properties[prop];
  return p?.title?.[0]?.plain_text || "";
}
function getText(page: any, prop: string): string {
  const p = page.properties[prop];
  return p?.rich_text?.[0]?.plain_text || "";
}
function getSelect(page: any, prop: string): string {
  return page.properties[prop]?.select?.name?.trim() || "";
}
function getMultiSelect(page: any, prop: string): string[] {
  return (page.properties[prop]?.multi_select || []).map((o: any) => o.name.trim());
}
function getDate(page: any, prop: string): string {
  return page.properties[prop]?.date?.start || "";
}

/** Search patients by name */
export async function searchPatients(query: string): Promise<PatientRow[]> {
  const data = await notionRequest<any>(`/databases/${DB_ID()}/query`, {
    method: "POST",
    body: {
      filter: query
        ? { property: "Name", title: { contains: query } }
        : undefined,
      sorts: [{ property: "Op Date", direction: "descending" }],
      page_size: 50,
    },
  });

  return data.results.map(transformToRow);
}

/** Get all patients (for dashboard overview) */
export async function getAllPatients(): Promise<PatientRow[]> {
  const pages: any[] = [];
  let cursor: string | undefined;

  do {
    const data = await notionRequest<any>(`/databases/${DB_ID()}/query`, {
      method: "POST",
      body: {
        sorts: [{ property: "Op Date", direction: "descending" }],
        page_size: 100,
        start_cursor: cursor,
      },
    });
    pages.push(...data.results);
    cursor = data.has_more ? data.next_cursor : undefined;
  } while (cursor);

  return pages.map(transformToRow);
}

/** Get single patient detail with full PROM data */
export async function getPatientDetail(pageId: string): Promise<PatientDetail | null> {
  try {
    const page = await notionRequest<any>(`/pages/${pageId}`);
    const { prom } = extractPromRecord(page.properties);
    const region = inferRegion(
      Object.fromEntries(
        Object.entries(page.properties)
          .filter(([k]) => k.includes("ODI") || k.includes("NDI"))
          .map(([k, v]: [string, any]) => [k, v?.rich_text?.[0]?.plain_text || ""])
      )
    );

    return {
      pageId: page.id,
      name: getTitle(page, "Name"),
      ptNo: getText(page, "Pt No"),
      age: parseInt(getText(page, "Age")) || 0,
      sex: getSelect(page, "Sex").includes("M") ? "M" : "F",
      opDate: getDate(page, "Op Date"),
      opName: getText(page, "Op Name"),
      hospital: getMultiSelect(page, "Hospital").join(", ") || "",
      surgeon: getMultiSelect(page, "Surgeon").join(", ") || "",
      region,
      prom,
    };
  } catch {
    return null;
  }
}

function transformToRow(page: any): PatientRow {
  const { promStatus } = extractPromRecord(page.properties);
  return {
    pageId: page.id,
    name: getTitle(page, "Name"),
    ptNo: getText(page, "Pt No"),
    age: parseInt(getText(page, "Age")) || 0,
    sex: getSelect(page, "Sex").includes("M") ? "M" as const : "F" as const,
    hospital: getMultiSelect(page, "Hospital").join(", "),
    surgeon: getMultiSelect(page, "Surgeon").join(", "),
    opDate: getDate(page, "Op Date"),
    opName: getText(page, "Op Name"),
    opCategory: getMultiSelect(page, "Op Category"),
    classA: getMultiSelect(page, "ClassA"),
    classB: getMultiSelect(page, "ClassB"),
    promStatus,
  };
}
```

- [ ] **Step 3: Export getRichText from calculator**

Update `src/lib/prom/calculator.ts` — make `getRichText` exported.

- [ ] **Step 4: Verify build**

Run: `npm run build`
Expected: Build succeeds (library files, no pages importing yet).

- [ ] **Step 5: Commit**

```bash
git add src/lib/notion/
git commit -m "feat: add Notion client and patient query functions"
```

---

## Task 5: Auth API Routes

**Files:**
- Create: `src/app/api/auth/login/route.ts`
- Create: `src/app/api/auth/logout/route.ts`

- [ ] **Step 1: Create login route**

Reference: `spinoscopy-dashboard/app/api/auth/login/route.ts`

```ts
// src/app/api/auth/login/route.ts
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(request: Request) {
  const { password } = await request.json();

  if (password !== process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ error: "Incorrect password" }, { status: 401 });
  }

  cookies().set("admin-auth", "authenticated", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 30, // 30 days
    path: "/",
  });

  return NextResponse.json({ ok: true });
}
```

- [ ] **Step 2: Create logout route**

```ts
// src/app/api/auth/logout/route.ts
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST() {
  cookies().delete("admin-auth");
  return NextResponse.json({ ok: true });
}
```

- [ ] **Step 3: Commit**

```bash
git add src/app/api/auth/
git commit -m "feat: add login/logout API routes"
```

---

## Task 6: Middleware Auth Check

**Files:**
- Modify: `src/middleware.ts`

- [ ] **Step 1: Add auth check for admin routes**

Add to the existing middleware, inside the `dashboard.` subdomain handler:

```ts
// After the dashboard subdomain detection, before rewriting:
if (hostname.startsWith("dashboard.")) {
  // Allow login page and auth API without cookie
  if (pathname === "/login" || pathname.startsWith("/api/auth/")) {
    const url = request.nextUrl.clone();
    url.pathname = `/admin${pathname}`;
    return NextResponse.rewrite(url);
  }

  // Check auth cookie
  const authCookie = request.cookies.get("admin-auth");
  if (!authCookie) {
    const url = request.nextUrl.clone();
    url.pathname = "/admin/login";
    return NextResponse.rewrite(url);
  }

  const url = request.nextUrl.clone();
  url.pathname = `/admin${pathname === "/" ? "" : pathname}`;
  return NextResponse.rewrite(url);
}
```

Also for localhost, add admin auth check:
```ts
if (hostname === "localhost" || hostname === "127.0.0.1") {
  // Protect admin routes on localhost too
  if (pathname.startsWith("/admin") && pathname !== "/admin/login" && !pathname.startsWith("/api/auth/")) {
    const authCookie = request.cookies.get("admin-auth");
    if (!authCookie) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
  }
  return NextResponse.next();
}
```

- [ ] **Step 2: Verify build**

Run: `npm run build`

- [ ] **Step 3: Commit**

```bash
git add src/middleware.ts
git commit -m "feat: add auth check for admin routes in middleware"
```

---

## Task 7: Login Page

**Files:**
- Create: `src/app/admin/login/page.tsx`

- [ ] **Step 1: Create login page**

Reference: `spinoscopy-dashboard/app/login/page.tsx`

Dark themed login page with password input, submit, error state.

```tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      if (!res.ok) {
        setError("비밀번호가 올바르지 않습니다");
        return;
      }

      router.push("/admin");
      router.refresh();
    } catch {
      setError("오류가 발생했습니다");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-950">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm rounded-2xl border border-zinc-800 bg-zinc-900 p-8"
      >
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white">
            <svg className="h-4 w-4 text-zinc-900" viewBox="0 0 20 20" fill="currentColor">
              <circle cx="10" cy="3" r="2" />
              <circle cx="10" cy="7.5" r="1.8" />
              <circle cx="10" cy="11.5" r="1.6" />
              <circle cx="10" cy="15" r="1.4" />
              <circle cx="10" cy="18" r="1.2" />
            </svg>
          </div>
          <span className="text-lg font-semibold text-white">SpineTrack</span>
        </div>

        <h1 className="mt-6 text-xl font-bold text-white">관리자 로그인</h1>
        <p className="mt-1 text-sm text-zinc-400">관리자 비밀번호를 입력하세요</p>

        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="비밀번호"
          className="mt-6 w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2.5 text-sm text-white placeholder-zinc-500 outline-none focus:border-blue-500"
          autoFocus
        />

        {error && (
          <p className="mt-2 text-sm text-red-400">{error}</p>
        )}

        <button
          type="submit"
          disabled={loading || !password}
          className="mt-4 w-full rounded-lg bg-white py-2.5 text-sm font-semibold text-zinc-900 transition-colors hover:bg-zinc-100 disabled:opacity-50"
        >
          {loading ? "로그인 중..." : "로그인"}
        </button>
      </form>
    </div>
  );
}
```

- [ ] **Step 2: Verify build + test**

Run: `npm run build`
Then: `npm run dev` → visit `http://localhost:3000/admin/login`

- [ ] **Step 3: Commit**

```bash
git add src/app/admin/login/
git commit -m "feat: add admin login page"
```

---

## Task 8: Admin Layout & Sidebar

**Files:**
- Modify: `src/app/admin/layout.tsx`
- Create: `src/app/admin/components/AdminSidebar.tsx`

- [ ] **Step 1: Create AdminSidebar**

```tsx
"use client";

import { usePathname, useRouter } from "next/navigation";
import { Users, BarChart3, LogOut } from "lucide-react";

const navItems = [
  { href: "/admin", label: "환자 목록", icon: Users },
  { href: "/admin/analytics", label: "Outcome 분석", icon: BarChart3, disabled: true },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <aside className="flex h-screen w-56 flex-col border-r border-zinc-800 bg-zinc-900">
      {/* Logo */}
      <div className="flex items-center gap-2 px-5 py-4">
        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-white">
          <svg className="h-3.5 w-3.5 text-zinc-900" viewBox="0 0 20 20" fill="currentColor">
            <circle cx="10" cy="3" r="2" />
            <circle cx="10" cy="7.5" r="1.8" />
            <circle cx="10" cy="11.5" r="1.6" />
            <circle cx="10" cy="15" r="1.4" />
            <circle cx="10" cy="18" r="1.2" />
          </svg>
        </div>
        <div>
          <div className="text-sm font-semibold text-white">SpineTrack</div>
          <div className="text-[10px] text-zinc-500">Dashboard</div>
        </div>
      </div>

      {/* Nav */}
      <nav className="mt-2 flex-1 px-3">
        {navItems.map((item) => {
          const active = pathname === item.href;
          return (
            <a
              key={item.href}
              href={item.disabled ? undefined : item.href}
              className={`flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm transition-colors ${
                item.disabled
                  ? "cursor-not-allowed text-zinc-600"
                  : active
                    ? "bg-zinc-800 text-white"
                    : "text-zinc-400 hover:bg-zinc-800/50 hover:text-white"
              }`}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
              {item.disabled && (
                <span className="ml-auto text-[9px] uppercase tracking-wider text-zinc-600">
                  Soon
                </span>
              )}
            </a>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="border-t border-zinc-800 px-3 py-3">
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-zinc-400 transition-colors hover:bg-zinc-800/50 hover:text-white"
        >
          <LogOut className="h-4 w-4" />
          로그아웃
        </button>
      </div>
    </aside>
  );
}
```

- [ ] **Step 2: Update admin layout**

```tsx
// src/app/admin/layout.tsx
"use client";

import { usePathname } from "next/navigation";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import AdminSidebar from "./components/AdminSidebar";
import { useState } from "react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isLoginPage = pathname === "/admin/login";
  const [queryClient] = useState(() => new QueryClient());

  if (isLoginPage) {
    return <>{children}</>;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <div className="flex h-screen bg-zinc-950 text-white">
        <AdminSidebar />
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </QueryClientProvider>
  );
}
```

- [ ] **Step 3: Verify build**

Run: `npm run build`

- [ ] **Step 4: Commit**

```bash
git add src/app/admin/
git commit -m "feat: add admin layout with sidebar and dark theme"
```

---

## Task 9: Patient List API Route

**Files:**
- Create: `src/app/api/admin/patients/route.ts`

- [ ] **Step 1: Create patients API**

```ts
// src/app/api/admin/patients/route.ts
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { searchPatients, getAllPatients } from "@/lib/notion/patients";

export async function GET(request: NextRequest) {
  // Auth check
  const auth = cookies().get("admin-auth");
  if (!auth) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const q = request.nextUrl.searchParams.get("q") || "";

  try {
    const patients = q ? await searchPatients(q) : await getAllPatients();
    return NextResponse.json({ patients });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
```

- [ ] **Step 2: Commit**

```bash
git add src/app/api/admin/
git commit -m "feat: add patient list API route"
```

---

## Task 10: Patient Detail API Route

**Files:**
- Create: `src/app/api/admin/patients/[pageId]/route.ts`

- [ ] **Step 1: Create patient detail API**

```ts
// src/app/api/admin/patients/[pageId]/route.ts
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getPatientDetail } from "@/lib/notion/patients";

export async function GET(
  _request: Request,
  { params }: { params: { pageId: string } }
) {
  const auth = cookies().get("admin-auth");
  if (!auth) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const patient = await getPatientDetail(params.pageId);
    if (!patient) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    return NextResponse.json(patient);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
```

- [ ] **Step 2: Commit**

```bash
git add src/app/api/admin/patients/
git commit -m "feat: add patient detail API route"
```

---

## Task 11: Patient Table Component

**Files:**
- Create: `src/app/admin/components/PatientTable.tsx`
- Create: `src/app/admin/components/PromStatusBadge.tsx`

- [ ] **Step 1: Create PromStatusBadge**

```tsx
// src/app/admin/components/PromStatusBadge.tsx
import type { PromStatus, Timepoint } from "@/lib/types/admin";

const TIMEPOINTS: { key: Timepoint; label: string }[] = [
  { key: "pre", label: "Pre" },
  { key: "1mo", label: "1M" },
  { key: "3mo", label: "3M" },
  { key: "6mo", label: "6M" },
  { key: "1y", label: "1Y" },
];

export default function PromStatusBadge({ status }: { status: PromStatus }) {
  const completed = Object.values(status).filter(Boolean).length;
  const total = TIMEPOINTS.length;

  return (
    <div className="flex items-center gap-1.5">
      {TIMEPOINTS.map((tp) => (
        <div
          key={tp.key}
          className={`flex h-6 w-8 items-center justify-center rounded text-[10px] font-medium ${
            status[tp.key]
              ? "bg-emerald-500/15 text-emerald-400"
              : "bg-zinc-800 text-zinc-600"
          }`}
          title={`${tp.label}: ${status[tp.key] ? "완료" : "미완료"}`}
        >
          {tp.label}
        </div>
      ))}
      <span className="ml-1 text-xs text-zinc-500">
        {completed}/{total}
      </span>
    </div>
  );
}
```

- [ ] **Step 2: Create PatientTable**

```tsx
// src/app/admin/components/PatientTable.tsx
"use client";

import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Search } from "lucide-react";
import type { PatientRow } from "@/lib/types/admin";
import PromStatusBadge from "./PromStatusBadge";

export default function PatientTable() {
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");

  // Debounce search
  const handleSearch = (value: string) => {
    setQuery(value);
    clearTimeout((window as any).__searchTimeout);
    (window as any).__searchTimeout = setTimeout(
      () => setDebouncedQuery(value),
      400
    );
  };

  const { data, isLoading } = useQuery({
    queryKey: ["patients", debouncedQuery],
    queryFn: async () => {
      const url = debouncedQuery
        ? `/api/admin/patients?q=${encodeURIComponent(debouncedQuery)}`
        : "/api/admin/patients";
      const res = await fetch(url);
      if (!res.ok) throw new Error("Failed to fetch");
      const json = await res.json();
      return json.patients as PatientRow[];
    },
  });

  const patients = data || [];

  return (
    <div>
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
        <input
          type="text"
          value={query}
          onChange={(e) => handleSearch(e.target.value)}
          placeholder="환자 이름으로 검색..."
          className="w-full rounded-lg border border-zinc-800 bg-zinc-900 py-2.5 pl-10 pr-4 text-sm text-white placeholder-zinc-500 outline-none focus:border-zinc-600"
        />
      </div>

      {/* Table */}
      <div className="mt-4 overflow-hidden rounded-xl border border-zinc-800">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-zinc-800 bg-zinc-900/50">
              <th className="px-4 py-3 text-left text-xs font-medium text-zinc-400">환자</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-zinc-400">수술</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-zinc-400">수술일</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-zinc-400">PROM</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-zinc-500">
                  불러오는 중...
                </td>
              </tr>
            ) : patients.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-zinc-500">
                  {debouncedQuery ? "검색 결과 없음" : "환자 데이터 없음"}
                </td>
              </tr>
            ) : (
              patients.map((p) => (
                <tr
                  key={p.pageId}
                  className="border-b border-zinc-800/50 transition-colors hover:bg-zinc-900/50 cursor-pointer"
                  onClick={() => window.location.href = `/admin/patients/${p.pageId}`}
                >
                  <td className="px-4 py-3">
                    <div className="font-medium text-white">{p.name}</div>
                    <div className="text-xs text-zinc-500">
                      {p.ptNo} · {p.sex}/{p.age} · {p.hospital}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-zinc-300">{p.opName}</td>
                  <td className="px-4 py-3 text-zinc-400">{p.opDate}</td>
                  <td className="px-4 py-3">
                    <PromStatusBadge status={p.promStatus} />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Count */}
      {!isLoading && patients.length > 0 && (
        <p className="mt-3 text-xs text-zinc-500">
          총 {patients.length}명
        </p>
      )}
    </div>
  );
}
```

- [ ] **Step 3: Commit**

```bash
git add src/app/admin/components/
git commit -m "feat: add patient table with PROM status badges"
```

---

## Task 12: PROM Chart Component

**Files:**
- Create: `src/app/admin/components/PromChart.tsx`

- [ ] **Step 1: Create PromChart**

Reference: `spinoscopy-dashboard/components/clinicus/PromChart.tsx`

Uses Recharts LineChart. Shows VAS, ODI/NDI, JOA, EQ-VAS across timepoints. Adapted for dark theme.

The component receives a `PatientDetail` and renders up to 4 charts depending on available data.

```tsx
"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import type { PatientDetail, Timepoint } from "@/lib/types/admin";

const TIMEPOINTS: Timepoint[] = ["pre", "1mo", "3mo", "6mo", "1y"];
const TP_LABELS: Record<Timepoint, string> = {
  pre: "수술 전",
  "1mo": "1개월",
  "3mo": "3개월",
  "6mo": "6개월",
  "1y": "1년",
};

const GRID_COLOR = "#27272a";
const AXIS_STYLE = { fill: "#71717a", fontSize: 11 };
const TOOLTIP_STYLE = {
  backgroundColor: "#18181b",
  border: "1px solid #3f3f46",
  borderRadius: 8,
  color: "#e4e4e7",
  fontSize: 12,
};

interface ChartConfig {
  title: string;
  dataKeys: { key: string; label: string; color: string }[];
  domain?: [number, number];
  getValue: (tp: Timepoint, detail: PatientDetail) => Record<string, number | null>;
  hasData: (detail: PatientDetail) => boolean;
}

const charts: ChartConfig[] = [
  {
    title: "VAS 통증",
    dataKeys: [
      { key: "prox", label: "근위부", color: "#f97316" },
      { key: "dist", label: "원위부", color: "#f59e0b" },
    ],
    domain: [0, 10],
    getValue: (tp, d) => ({
      prox: d.prom[tp]?.vasProx ?? null,
      dist: d.prom[tp]?.vasDist ?? null,
    }),
    hasData: (d) =>
      TIMEPOINTS.some((tp) => d.prom[tp]?.vasProx !== null),
  },
  {
    title: "ODI / NDI (%)",
    dataKeys: [
      { key: "score", label: "점수", color: "#3b82f6" },
    ],
    domain: [0, 100],
    getValue: (tp, d) => ({
      score:
        d.region === "cervical"
          ? d.prom[tp]?.ndiPercent ?? null
          : d.prom[tp]?.odiPercent ?? null,
    }),
    hasData: (d) =>
      TIMEPOINTS.some(
        (tp) => d.prom[tp]?.odiPercent !== null || d.prom[tp]?.ndiPercent !== null
      ),
  },
  {
    title: "JOA 점수",
    dataKeys: [{ key: "score", label: "JOA", color: "#8b5cf6" }],
    domain: [0, 17],
    getValue: (tp, d) => ({ score: d.prom[tp]?.joaScore ?? null }),
    hasData: (d) =>
      TIMEPOINTS.some((tp) => d.prom[tp]?.joaScore !== null),
  },
  {
    title: "EQ-VAS",
    dataKeys: [{ key: "score", label: "EQ-VAS", color: "#10b981" }],
    domain: [0, 100],
    getValue: (tp, d) => ({ score: d.prom[tp]?.eqVas ?? null }),
    hasData: (d) =>
      TIMEPOINTS.some((tp) => d.prom[tp]?.eqVas !== null),
  },
];

export default function PromChart({ patient }: { patient: PatientDetail }) {
  const activeCharts = charts.filter((c) => c.hasData(patient));

  if (activeCharts.length === 0) {
    return (
      <p className="py-8 text-center text-sm text-zinc-500">
        PROM 데이터가 없습니다
      </p>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {activeCharts.map((chart) => {
        const data = TIMEPOINTS.map((tp) => ({
          name: TP_LABELS[tp],
          ...chart.getValue(tp, patient),
        }));

        return (
          <div
            key={chart.title}
            className="rounded-xl border border-zinc-800 bg-zinc-900 p-4"
          >
            <h4 className="mb-3 text-sm font-medium text-zinc-300">
              {chart.title}
              {chart.title.includes("ODI") && (
                <span className="ml-2 text-xs text-zinc-500">
                  ({patient.region === "cervical" ? "NDI" : "ODI"})
                </span>
              )}
            </h4>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={data}>
                <CartesianGrid stroke={GRID_COLOR} strokeDasharray="3 3" />
                <XAxis
                  dataKey="name"
                  tick={AXIS_STYLE}
                  axisLine={{ stroke: GRID_COLOR }}
                />
                <YAxis
                  domain={chart.domain}
                  tick={AXIS_STYLE}
                  axisLine={{ stroke: GRID_COLOR }}
                  width={30}
                />
                <Tooltip contentStyle={TOOLTIP_STYLE} />
                {chart.dataKeys.map((dk) => (
                  <Line
                    key={dk.key}
                    type="monotone"
                    dataKey={dk.key}
                    name={dk.label}
                    stroke={dk.color}
                    strokeWidth={2}
                    dot={{ fill: dk.color, r: 3 }}
                    connectNulls
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </div>
        );
      })}
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/app/admin/components/PromChart.tsx
git commit -m "feat: add PROM chart component for admin dashboard"
```

---

## Task 13: Admin Main Page

**Files:**
- Modify: `src/app/admin/page.tsx`

- [ ] **Step 1: Build main admin page**

```tsx
// src/app/admin/page.tsx
import PatientTable from "./components/PatientTable";

export default function AdminDashboardPage() {
  return (
    <div className="mx-auto max-w-5xl">
      <div>
        <h1 className="text-2xl font-bold text-white">환자 관리</h1>
        <p className="mt-1 text-sm text-zinc-400">
          등록된 환자 목록과 PROM 응답 현황
        </p>
      </div>
      <div className="mt-6">
        <PatientTable />
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/app/admin/page.tsx
git commit -m "feat: add admin main page with patient table"
```

---

## Task 14: Patient Detail Page (PROM Charts)

**Files:**
- Create: `src/app/admin/patients/[pageId]/page.tsx`

- [ ] **Step 1: Create patient detail page**

```tsx
// src/app/admin/patients/[pageId]/page.tsx
"use client";

import { useQuery } from "@tanstack/react-query";
import { ArrowLeft } from "lucide-react";
import PromChart from "../../components/PromChart";
import PromStatusBadge from "../../components/PromStatusBadge";
import type { PatientDetail } from "@/lib/types/admin";

export default function PatientDetailPage({
  params,
}: {
  params: { pageId: string };
}) {
  const { data: patient, isLoading } = useQuery({
    queryKey: ["patient", params.pageId],
    queryFn: async () => {
      const res = await fetch(`/api/admin/patients/${params.pageId}`);
      if (!res.ok) throw new Error("Failed to fetch");
      return res.json() as Promise<PatientDetail>;
    },
  });

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center text-zinc-500">
        불러오는 중...
      </div>
    );
  }

  if (!patient) {
    return (
      <div className="flex h-64 items-center justify-center text-zinc-500">
        환자를 찾을 수 없습니다
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl">
      {/* Back */}
      <a
        href="/admin"
        className="inline-flex items-center gap-1.5 text-sm text-zinc-400 transition-colors hover:text-white"
      >
        <ArrowLeft className="h-4 w-4" />
        환자 목록
      </a>

      {/* Patient info */}
      <div className="mt-4 rounded-xl border border-zinc-800 bg-zinc-900 p-6">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-xl font-bold text-white">{patient.name}</h1>
            <p className="mt-1 text-sm text-zinc-400">
              {patient.ptNo} · {patient.sex}/{patient.age} · {patient.hospital}
            </p>
          </div>
          <div className="text-right">
            <div className="text-sm text-zinc-300">{patient.opName}</div>
            <div className="text-xs text-zinc-500">{patient.opDate}</div>
          </div>
        </div>

        {/* PROM status overview */}
        <div className="mt-4 border-t border-zinc-800 pt-4">
          <span className="text-xs font-medium text-zinc-500">PROM 응답 현황</span>
          <div className="mt-2">
            <PromStatusBadge
              status={
                Object.fromEntries(
                  (["pre", "1mo", "3mo", "6mo", "1y"] as const).map((tp) => [
                    tp,
                    patient.prom[tp]
                      ? Object.values(patient.prom[tp]!).some((v) => v !== null)
                      : false,
                  ])
                ) as any
              }
            />
          </div>
        </div>
      </div>

      {/* PROM Charts */}
      <div className="mt-6">
        <h2 className="text-lg font-semibold text-white">PROM 추이</h2>
        <div className="mt-4">
          <PromChart patient={patient} />
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Verify build**

Run: `npm run build`

- [ ] **Step 3: Commit**

```bash
git add src/app/admin/patients/
git commit -m "feat: add patient detail page with PROM charts"
```

---

## Task 15: Final Build + Screenshots + CHANGELOG

**Files:**
- Modify: `e2e/screenshots.spec.ts`
- Modify: `CHANGELOG.md`

- [ ] **Step 1: Add admin screenshots to Playwright**

Add to the pages array in `e2e/screenshots.spec.ts`:
```ts
{ name: "admin-login", path: "/admin/login" },
```

- [ ] **Step 2: Full build check**

Run: `npm run build`
Expected: Clean build.

- [ ] **Step 3: Run screenshots**

Run: `npx playwright test e2e/screenshots.spec.ts`
Review screenshots.

- [ ] **Step 4: Update CHANGELOG.md**

```markdown
### Added
- 관리자 대시보드 MVP (dashboard.spinetrack.ai)
  - 비밀번호 기반 로그인 (httpOnly cookie)
  - 환자 목록 + 검색 (Notion DB 연동)
  - PROM 응답 현황 뱃지 (Pre/1M/3M/6M/1Y)
  - 개별 환자 PROM 추이 차트 (VAS, ODI/NDI, JOA, EQ-VAS)
  - 다크 테마 사이드바 레이아웃
```

- [ ] **Step 5: Final commit**

```bash
git add -A
git commit -m "feat: complete admin dashboard MVP (login, patient list, PROM charts)"
```
