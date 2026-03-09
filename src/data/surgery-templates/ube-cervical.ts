import type { SurgeryTemplate } from "./types";
import { lpTemplate } from "./lp";

// Reuse LP perioperative pathway as baseline for cervical UBE,
// while exposing a distinct dashboard category.
export const ubeCervicalTemplate: SurgeryTemplate = {
  ...lpTemplate,
  type: "ube_cervical",
  name: "Cervical UBE Decompression",
  nameKo: "양방향 내시경 경추 감압술",
  abbreviation: "UBE",
  durationMinutes: 120,
  stayNights: 2,
  promInstruments: ["vas", "ndi", "joa", "eq5d", "eqvas"],
  vasConfig: {
    scales: [
      { id: "vas_neck", label: "목 통증" },
      { id: "vas_arm", label: "팔 통증 / 저림" },
    ],
  },
};
