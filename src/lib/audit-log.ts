export type AuditEventType =
  | "auth_success"
  | "auth_failure"
  | "prom_sync_success"
  | "prom_sync_failure"
  | "triage_alert";

export interface AuditEvent {
  type: AuditEventType;
  patientId: string;
  detail: string;
  timestamp: string;
}

const AUDIT_KEY = "spine-track-audit-log-v1";
const MAX_EVENTS = 200;

export function logAuditEvent(event: AuditEvent): void {
  if (typeof window === "undefined") return;
  try {
    const raw = localStorage.getItem(AUDIT_KEY);
    const existing = raw ? (JSON.parse(raw) as AuditEvent[]) : [];
    const next = [event, ...existing].slice(0, MAX_EVENTS);
    localStorage.setItem(AUDIT_KEY, JSON.stringify(next));
  } catch {
    // Ignore local storage failures in audit side-channel.
  }
}
