import type { SurgeryType } from "@/data/surgery-templates/types";

function normalize(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "");
}

export function detectSurgeryType(categories: string[], opName = ""): SurgeryType {
  const values = [...categories, opName].map(normalize).filter(Boolean);
  const hasAny = (keywords: string[]) =>
    values.some((v) => keywords.some((keyword) => v.includes(keyword)));

  const hasAcdf = hasAny(["acdf"]);
  const hasLp = hasAny(["lp", "laminoplasty", "laminectomy"]);
  const hasFusion = hasAny([
    "fusion",
    "tlif",
    "olif",
    "dlif",
    "plif",
    "ppf",
    "psf",
  ]);
  const hasVp = hasAny(["vp", "fimsv", "vertebroplasty"]);
  const hasUbe = hasAny(["ube"]);
  const hasUbeLumbarDecomp = hasAny([
    "ulbd",
    "discectomy",
    "foraminaldecomp",
    "fos",
    "lrdecomp",
  ]);
  const hasUbeCervicalDecomp = hasAny(["culbd", "pcf"]);

  // Priority for multi-select conflicts:
  // ACDF > LP > Fusion > VP > UBE cervical > UBE lumbar.
  if (hasAcdf) return "acdf";
  if (hasLp) return "lp";
  if (hasFusion) return "fusion";
  if (hasVp) return "vp";
  if (hasUbe && hasUbeCervicalDecomp) return "ube_cervical";
  if (hasUbe && (hasUbeLumbarDecomp || !hasUbeCervicalDecomp)) return "ube_lumbar";

  // Default lumbar UBE only when UBE keyword exists without other markers.
  return "ube_lumbar";
}

export function getSurgeryTypeLabel(type: SurgeryType): string {
  switch (type) {
    case "ube_lumbar":
      return "UBE Lumbar Decompression";
    case "fusion":
      return "Lumbar Fusion";
    case "vp":
      return "VP / FIMS V";
    case "ube_cervical":
      return "UBE Cervical Decompression";
    case "lp":
      return "Cervical Laminoplasty";
    case "acdf":
      return "ACDF";
    default:
      return "Spine Surgery";
  }
}
