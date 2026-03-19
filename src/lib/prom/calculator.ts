/**
 * PROM Score Calculator
 * Ported from spinoscopy-dashboard/lib/prom/calculator.ts
 */

import type { ParsedProm, Timepoint } from "@/lib/types/admin";

// ---------------------------------------------------------------------------
// Korean EQ-5D-5L Value Set (Kim SH et al., 2016, Qual Life Res)
// ---------------------------------------------------------------------------
const KR_CONSTANT = 0.096;
const KR_N4 = 0.078;

type Level = 1 | 2 | 3 | 4 | 5;
type DimCoeff = Record<Level, number>;

const KR_COEFFS: Record<string, DimCoeff> = {
  MO: { 1: 0, 2: 0.046, 3: 0.058, 4: 0.133, 5: 0.251 },
  SC: { 1: 0, 2: 0.032, 3: 0.05, 4: 0.078, 5: 0.122 },
  UA: { 1: 0, 2: 0.021, 3: 0.051, 4: 0.1, 5: 0.175 },
  PD: { 1: 0, 2: 0.042, 3: 0.053, 4: 0.166, 5: 0.207 },
  AD: { 1: 0, 2: 0.033, 3: 0.046, 4: 0.102, 5: 0.137 },
};

// ---------------------------------------------------------------------------
// Parse VAS: "3/2" → { prox: 3, dist: 2 }
// ---------------------------------------------------------------------------
export function parseVAS(
  str: string
): { prox: number | null; dist: number | null } {
  if (!str) return { prox: null, dist: null };
  const parts = str.trim().split("/");
  if (parts.length !== 2) return { prox: null, dist: null };
  const a = parseFloat(parts[0].trim());
  const b = parseFloat(parts[1].trim());
  return {
    prox: isNaN(a) ? null : a,
    dist: isNaN(b) ? null : b,
  };
}

// ---------------------------------------------------------------------------
// Parse ODI: "22/50" → percent
// ---------------------------------------------------------------------------
export function parseODI(str: string): number | null {
  if (!str) return null;
  const parts = str.trim().split("/");
  if (parts.length === 2) {
    const raw = parseFloat(parts[0].trim());
    const max = parseFloat(parts[1].trim());
    if (isNaN(raw) || isNaN(max) || max === 0) return null;
    return Math.round((raw / max) * 1000) / 10;
  }
  const val = parseFloat(str.trim());
  return isNaN(val) ? null : val;
}

// ---------------------------------------------------------------------------
// Parse NDI: same format as ODI ("raw/50")
// ---------------------------------------------------------------------------
export function parseNDI(str: string): number | null {
  return parseODI(str);
}

// ---------------------------------------------------------------------------
// Parse JOA: raw number
// ---------------------------------------------------------------------------
export function parseJOA(str: string): number | null {
  if (!str) return null;
  const val = parseFloat(str.trim());
  return isNaN(val) ? null : val;
}

// ---------------------------------------------------------------------------
// Parse EQ-5D: "11131/75" → { utility, vas }
// Korean EQ-5D-5L utility (Kim et al. 2016)
// ---------------------------------------------------------------------------
export function parseEQ5D(
  str: string
): { utility: number | null; vas: number | null } {
  if (!str) return { utility: null, vas: null };
  const parts = str.trim().split(/[/,]\s*/);
  if (parts.length !== 2) return { utility: null, vas: null };

  const profileStr = parts[0].trim();
  const eqVas = parseFloat(parts[1].trim());
  if (isNaN(eqVas) || profileStr.length !== 5) return { utility: null, vas: null };

  const dims = profileStr.split("").map(Number);
  if (dims.some((d) => isNaN(d) || d < 1 || d > 5))
    return { utility: null, vas: eqVas };

  const [mo, sc, ua, pd, ad] = dims as Level[];
  const hasN4 = dims.some((d) => d >= 4);

  const decrement =
    KR_CONSTANT +
    KR_COEFFS.MO[mo] +
    KR_COEFFS.SC[sc] +
    KR_COEFFS.UA[ua] +
    KR_COEFFS.PD[pd] +
    KR_COEFFS.AD[ad] +
    (hasN4 ? KR_N4 : 0);

  const utility = Math.round((1 - decrement) * 1000) / 1000;

  return { utility, vas: eqVas };
}

// ---------------------------------------------------------------------------
// Infer spine region from PROM fields
// ---------------------------------------------------------------------------
export function inferRegion(
  promData: Record<string, string>
): "cervical" | "lumbar" | "unknown" {
  const hasNDI = Object.keys(promData).some(
    (k) => k.includes("NDI") && promData[k]
  );
  const hasODI = Object.keys(promData).some(
    (k) => k.includes("ODI") && promData[k]
  );
  if (hasNDI && !hasODI) return "cervical";
  if (hasODI && !hasNDI) return "lumbar";
  return "unknown";
}

// ---------------------------------------------------------------------------
// Extract all PROM data from Notion page properties
// ---------------------------------------------------------------------------
const TIMEPOINTS: Timepoint[] = ["pre", "1mo", "3mo", "6mo", "1y"];

export function getRichText(
  properties: Record<string, any>,
  key: string
): string {
  const p = properties[key];
  if (!p || !p.rich_text || p.rich_text.length === 0) return "";
  return p.rich_text[0].plain_text || "";
}

export function extractPromRecord(properties: Record<string, any>): {
  prom: Record<Timepoint, ParsedProm>;
  promStatus: Record<Timepoint, boolean>;
} {
  const prom: Record<string, ParsedProm> = {};
  const promStatus: Record<string, boolean> = {};

  for (const tp of TIMEPOINTS) {
    const vasStr = getRichText(properties, `${tp} VAS`);
    const odiStr = getRichText(properties, `${tp} ODI`);
    const ndiStr = getRichText(properties, `${tp} NDI`);
    const joaStr = getRichText(properties, `${tp} JOA`);
    const eq5dStr = getRichText(properties, `${tp} EQ5D`);

    const vas = parseVAS(vasStr);
    const eq5d = parseEQ5D(eq5dStr);

    prom[tp] = {
      vasProx: vas.prox,
      vasDist: vas.dist,
      odiPercent: parseODI(odiStr),
      ndiPercent: parseNDI(ndiStr),
      joaScore: parseJOA(joaStr),
      eq5dUtility: eq5d.utility,
      eqVas: eq5d.vas,
    };

    promStatus[tp] = !!(vasStr || odiStr || ndiStr || joaStr || eq5dStr);
  }

  return {
    prom: prom as Record<Timepoint, ParsedProm>,
    promStatus: promStatus as Record<Timepoint, boolean>,
  };
}
