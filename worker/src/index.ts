import type { Env, PromSubmission } from "./types";
import { fetchPatientByPtNo, getNotionPageId, writePromToNotion } from "./notion";

const CACHE_TTL = 300; // 5 minutes
const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

function jsonResponse(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json", ...CORS_HEADERS },
  });
}

function extractPtNo(host: string): string | null {
  // "09782901.takmd.com" → "09782901"
  // "takmd.com" → null (bare domain)
  // "localhost:8787" → use ?ptno= query param for dev
  const parts = host.replace(/:\d+$/, "").split(".");
  if (parts.length >= 3) return parts[0];
  return null;
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    // CORS preflight
    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: CORS_HEADERS });
    }

    // Extract patient number from subdomain (or ?ptno= for local dev)
    const host = request.headers.get("Host") || "";
    const ptNo = extractPtNo(host) || url.searchParams.get("ptno");

    // ── API Routes ──

    if (url.pathname === "/api/patient") {
      if (!ptNo) {
        return jsonResponse({ error: "No patient number in subdomain" }, 400);
      }

      // Check KV cache first
      const cacheKey = `patient:${ptNo}`;
      const cached = await env.PATIENT_CACHE.get(cacheKey, "text");
      if (cached) {
        return new Response(cached, {
          headers: { "Content-Type": "application/json", ...CORS_HEADERS },
        });
      }

      // Fetch from Notion
      const data = await fetchPatientByPtNo(ptNo, env);
      if (!data) {
        return jsonResponse({ error: "Patient not found" }, 404);
      }

      // Store in KV cache
      const json = JSON.stringify(data);
      await env.PATIENT_CACHE.put(cacheKey, json, { expirationTtl: CACHE_TTL });

      return new Response(json, {
        headers: { "Content-Type": "application/json", ...CORS_HEADERS },
      });
    }

    if (url.pathname === "/api/prom" && request.method === "POST") {
      if (!ptNo) {
        return jsonResponse({ error: "No patient number in subdomain" }, 400);
      }

      let body: PromSubmission & { opDate?: string };
      try {
        body = await request.json();
      } catch {
        return jsonResponse({ error: "Invalid JSON" }, 400);
      }

      // Get Notion page ID
      const pageId = await getNotionPageId(ptNo, env);
      if (!pageId) {
        return jsonResponse({ error: "Patient not found" }, 404);
      }

      // We need opDate — fetch patient data (may be cached)
      const cacheKey = `patient:${ptNo}`;
      let opDate = body.opDate;
      if (!opDate) {
        const cached = await env.PATIENT_CACHE.get(cacheKey, "text");
        if (cached) {
          const parsed = JSON.parse(cached);
          opDate = parsed.patient.surgery.date;
        } else {
          const data = await fetchPatientByPtNo(ptNo, env);
          opDate = data?.patient.surgery.date;
        }
      }

      if (!opDate) {
        return jsonResponse({ error: "Cannot determine surgery date" }, 400);
      }

      // Write to Notion
      const success = await writePromToNotion(pageId, opDate, body, env);
      if (!success) {
        return jsonResponse({ error: "Failed to write to Notion" }, 500);
      }

      // Invalidate cache so next load reflects new data
      await env.PATIENT_CACHE.delete(cacheKey);

      return jsonResponse({ ok: true });
    }

    // ── Static Asset Proxy ──
    // Forward all other requests to the Pages deployment

    const pagesUrl = new URL(url.pathname + url.search, `https://${env.PAGES_DOMAIN}`);

    const pagesResponse = await fetch(pagesUrl.toString(), {
      method: request.method,
      headers: {
        "User-Agent": "takmd-gateway",
        Accept: request.headers.get("Accept") || "*/*",
      },
    });

    // If Pages returns 404, serve index.html for SPA client-side routing
    if (pagesResponse.status === 404 && !url.pathname.includes(".")) {
      const spaResponse = await fetch(`https://${env.PAGES_DOMAIN}/index.html`, {
        headers: { "User-Agent": "takmd-gateway", Accept: "text/html" },
      });
      return new Response(spaResponse.body, {
        status: 200,
        headers: {
          "Content-Type": "text/html; charset=utf-8",
          "Cache-Control": "no-cache",
        },
      });
    }

    // Pass through Pages response with original headers
    return new Response(pagesResponse.body, {
      status: pagesResponse.status,
      headers: pagesResponse.headers,
    });
  },
};
