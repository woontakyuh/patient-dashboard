import { notionRequest } from "./client";
import {
  extractPromRecord,
  inferRegion,
  getRichText,
} from "@/lib/prom/calculator";
import type { PatientRow, PatientDetail } from "@/lib/types/admin";

const DB_ID = () => process.env.NOTION_PATIENT_DB_ID!;

// --- Notion property helpers ---

function getTitle(page: any, prop: string): string {
  return page.properties[prop]?.title?.[0]?.plain_text || "";
}
function getText(page: any, prop: string): string {
  return page.properties[prop]?.rich_text?.[0]?.plain_text || "";
}
function getSelect(page: any, prop: string): string {
  return page.properties[prop]?.select?.name?.trim() || "";
}
function getMultiSelect(page: any, prop: string): string[] {
  return (page.properties[prop]?.multi_select || []).map(
    (o: any) => o.name.trim()
  );
}
function getDate(page: any, prop: string): string {
  return page.properties[prop]?.date?.start || "";
}

// --- Public API ---

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

export async function getPatientDetail(
  pageId: string
): Promise<PatientDetail | null> {
  try {
    const page = await notionRequest<any>(`/pages/${pageId}`);
    const { prom } = extractPromRecord(page.properties);

    // Build a map of all PROM text fields for region inference
    const promTextMap: Record<string, string> = {};
    for (const tp of ["pre", "1mo", "3mo", "6mo", "1y"]) {
      for (const key of ["ODI", "NDI"]) {
        promTextMap[`${tp} ${key}`] = getRichText(page.properties, `${tp} ${key}`);
      }
    }
    const region = inferRegion(promTextMap);

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
    sex: getSelect(page, "Sex").includes("M") ? ("M" as const) : ("F" as const),
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
