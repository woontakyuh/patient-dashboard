import type { Env, Patient, PromTrendPoint, PatientApiResponse, PromSubmission } from "./types";
import { getTemplate, getSurgeryAbbreviation, getSurgeryNameKo, getPromInstruments } from "./templates";

// ── Notion property helpers ──

function getTitle(page: any, prop: string): string {
  const p = page.properties[prop];
  if (!p || !p.title || p.title.length === 0) return "";
  return p.title[0].plain_text || "";
}

function getText(page: any, prop: string): string {
  const p = page.properties[prop];
  if (!p || !p.rich_text || p.rich_text.length === 0) return "";
  return p.rich_text[0].plain_text || "";
}

function getSelect(page: any, prop: string): string {
  const p = page.properties[prop];
  if (!p || !p.select) return "";
  return (p.select.name || "").trim();
}

function getMultiSelect(page: any, prop: string): string[] {
  const p = page.properties[prop];
  if (!p || !p.multi_select) return [];
  return p.multi_select.map((o: any) => o.name.trim());
}

function getDate(page: any, prop: string): string {
  const p = page.properties[prop];
  if (!p || !p.date) return "";
  return p.date.start || "";
}

// ── Follow-up date calculation ──

function addDays(dateStr: string, days: number): string {
  const d = new Date(dateStr);
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

function calculateFollowUps(opDate: string, firstOpdDate?: string) {
  const schedule = [
    { label: "2주 외래", days: 14 },
    { label: "6주 외래", days: 42 },
    { label: "3개월 외래", days: 90 },
    { label: "6개월 외래", days: 180 },
    { label: "1년 외래", days: 365 },
  ];
  return schedule.map((s, i) => ({
    label: s.label,
    date: i === 0 && firstOpdDate ? firstOpdDate : addDays(opDate, s.days),
  }));
}

// ── Stage status computation ──

function computeStageStatus(stageDate: string | null): "completed" | "current" | "upcoming" {
  if (!stageDate) return "upcoming";
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const d = new Date(stageDate);
  d.setHours(0, 0, 0, 0);
  const diffDays = (d.getTime() - today.getTime()) / (1000 * 60 * 60 * 24);
  if (diffDays < -1) return "completed";
  if (diffDays <= 1) return "current";
  return "upcoming";
}

// ── Transform Notion page → Patient ──

function transformNotionToPatient(page: any): PatientApiResponse {
  const name = getTitle(page, "Name");
  const ptNo = getText(page, "Pt No");
  const age = parseInt(getText(page, "Age")) || 0;
  const sex = getSelect(page, "Sex").includes("M") ? "M" as const : "F" as const;
  const level = getText(page, "Level");
  const preopDx = getText(page, "Preop Dx");
  const opName = getText(page, "Op Name");
  const opDate = getDate(page, "Op Date");
  const admDate = getDate(page, "Adm Date") || (opDate ? addDays(opDate, -1) : "");
  const firstOpd = getDate(page, "1st OPD");
  const categories = getMultiSelect(page, "Op Category");
  const schedule = getText(page, "Sch") || getSelect(page, "Sch") || undefined;
  const hospital = getMultiSelect(page, "Hospital").join(", ") || "다보스 병원";
  const surgeon = getMultiSelect(page, "Surgeon").join(", ");
  // Determine surgery type for template
  const abbreviation = getSurgeryAbbreviation(categories, opName);
  const nameKo = getSurgeryNameKo(categories, opName);
  const promInstruments = getPromInstruments(categories);

  // Build follow-ups
  const followUps = opDate ? calculateFollowUps(opDate, firstOpd) : [];

  // Build stages from template
  const template = getTemplate(categories);
  const expectedDischarge = opDate ? addDays(opDate, 1) : "";
  const stages = template.map((t) => {
    const stageDate = t.dateOffset !== null && opDate
      ? addDays(opDate, t.dateOffset)
      : "";
    return {
      ...t,
      date: stageDate,
      status: computeStageStatus(stageDate || null),
    };
  });

  // Build PROM trend
  const promTrend = extractPromTrend(page, opDate, followUps);

  const patient: Patient = {
    id: ptNo,
    subdomain: ptNo,
    name,
    age,
    sex,
    diagnosis: {
      code: level,
      name: preopDx,
      nameKo: preopDx,
    },
    surgery: {
      name: opName,
      nameKo: nameKo,
      abbreviation,
      date: opDate,
      categories,
      schedule,
    },
    admission: {
      date: admDate,
      expectedDischarge,
    },
    hospital,
    surgeon,
    promInstruments,
    followUps,
    stages,
  };

  return { patient, promTrend };
}

// ── Extract PROM trend data from Notion fields ──

function extractPromTrend(page: any, opDate: string, followUps: { label: string; date: string }[]): PromTrendPoint[] {
  const timepoints = [
    { label: "수술 전", prefix: "pre", date: opDate ? addDays(opDate, -1) : "" },
    { label: "1개월", prefix: "1mo", date: followUps[0]?.date || "" },
    { label: "3개월", prefix: "3mo", date: followUps[2]?.date || "" },
    { label: "6개월", prefix: "6mo", date: followUps[3]?.date || "" },
    { label: "1년", prefix: "1y", date: followUps[4]?.date || "" },
  ];

  return timepoints
    .map((tp) => {
      const vasStr = getText(page, `${tp.prefix} VAS`);
      const odiStr = getText(page, `${tp.prefix} ODI`);
      const ndiStr = getText(page, `${tp.prefix} NDI`);
      const joaStr = getText(page, `${tp.prefix} JOA`);
      const eq5dStr = getText(page, `${tp.prefix} EQ5D`);

      // Parse VAS: could be "3/2" (back/leg) or just "3"
      let vasBack: number | null = null;
      let vasLeg: number | null = null;
      if (vasStr) {
        const parts = vasStr.split("/");
        vasBack = parseFloat(parts[0]) || null;
        vasLeg = parts.length > 1 ? parseFloat(parts[1]) || null : null;
      }

      return {
        label: tp.label,
        date: tp.date,
        vas_back: vasBack,
        vas_leg: vasLeg,
        odi_percent: odiStr ? parseFloat(odiStr) || null : null,
        ndi_percent: ndiStr ? parseFloat(ndiStr) || null : null,
        joa_score: joaStr ? parseFloat(joaStr) || null : null,
        eq_vas: eq5dStr ? parseFloat(eq5dStr) || null : null,
      };
    })
    .filter((p) => p.vas_back !== null || p.odi_percent !== null || p.joa_score !== null);
}

// ── Public API ──

export async function fetchPatientByPtNo(ptNo: string, env: Env): Promise<PatientApiResponse | null> {
  const response = await fetch(
    `https://api.notion.com/v1/databases/${env.NOTION_DATABASE_ID}/query`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${env.NOTION_API_KEY}`,
        "Notion-Version": "2022-06-28",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        filter: {
          property: "Pt No",
          rich_text: { equals: ptNo },
        },
      }),
    }
  );

  const data = (await response.json()) as any;
  if (!data.results || data.results.length === 0) return null;

  return transformNotionToPatient(data.results[0]);
}

export async function getNotionPageId(ptNo: string, env: Env): Promise<string | null> {
  const response = await fetch(
    `https://api.notion.com/v1/databases/${env.NOTION_DATABASE_ID}/query`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${env.NOTION_API_KEY}`,
        "Notion-Version": "2022-06-28",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        filter: {
          property: "Pt No",
          rich_text: { equals: ptNo },
        },
      }),
    }
  );

  const data = (await response.json()) as any;
  if (!data.results || data.results.length === 0) return null;
  return data.results[0].id;
}

export async function writePromToNotion(
  pageId: string,
  opDate: string,
  submission: PromSubmission,
  env: Env
): Promise<boolean> {
  // Determine timepoint based on days since surgery
  const daysSinceOp = Math.floor(
    (Date.now() - new Date(opDate).getTime()) / (1000 * 60 * 60 * 24)
  );

  let prefix: string;
  if (daysSinceOp < 7) prefix = "pre";
  else if (daysSinceOp < 28) prefix = "1mo";
  else if (daysSinceOp < 120) prefix = "3mo";
  else if (daysSinceOp < 270) prefix = "6mo";
  else prefix = "1y";

  // Build Notion properties update
  const vasValue = `${submission.vas_back}/${submission.vas_leg}`;
  const properties: Record<string, any> = {
    [`${prefix} VAS`]: { rich_text: [{ text: { content: vasValue } }] },
    [`${prefix} JOA`]: { rich_text: [{ text: { content: String(submission.joa_score) } }] },
    [`${prefix} EQ5D`]: { rich_text: [{ text: { content: String(submission.eq_vas) } }] },
  };

  // ODI or NDI
  if (submission.odi_total_percent !== undefined) {
    properties[`${prefix} ODI`] = { rich_text: [{ text: { content: String(submission.odi_total_percent) } }] };
  }
  if (submission.ndi_total_percent !== undefined) {
    properties[`${prefix} NDI`] = { rich_text: [{ text: { content: String(submission.ndi_total_percent) } }] };
  }

  const response = await fetch(`https://api.notion.com/v1/pages/${pageId}`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${env.NOTION_API_KEY}`,
      "Notion-Version": "2022-06-28",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ properties }),
  });

  return response.ok;
}
