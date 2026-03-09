import type { SurgeryTemplate, SurgeryType } from "./types";
import { ubeTemplate } from "./ube";
import { ubeCervicalTemplate } from "./ube-cervical";
import { vpTemplate } from "./vp";
import { acdfTemplate } from "./acdf";
import { lpTemplate } from "./lp";
import { fusionTemplate } from "./fusion";

export type { SurgeryTemplate, SurgeryType, PromInstrumentId, VasConfig, TemplateStage, TemplateDaySchedule } from "./types";

const templates: Record<SurgeryType, SurgeryTemplate> = {
  ube_lumbar: ubeTemplate,
  ube_cervical: ubeCervicalTemplate,
  vp: vpTemplate,
  acdf: acdfTemplate,
  lp: lpTemplate,
  fusion: fusionTemplate,
};

export function getSurgeryTemplate(type: SurgeryType): SurgeryTemplate {
  return templates[type];
}

export function getAllSurgeryTypes(): SurgeryType[] {
  return Object.keys(templates) as SurgeryType[];
}
