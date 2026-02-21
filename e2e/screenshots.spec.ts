import { test } from "@playwright/test";

const pages = [
  { name: "dashboard", path: "/patient/P001" },
  { name: "timeline", path: "/patient/P001/timeline" },
  { name: "instructions-preop", path: "/patient/P001/instructions/pre-op" },
  { name: "instructions-surgery", path: "/patient/P001/instructions/surgery-day" },
  { name: "instructions-pod1", path: "/patient/P001/instructions/pod1" },
  { name: "instructions-discharge", path: "/patient/P001/instructions/discharge" },
  { name: "instructions-fu2w", path: "/patient/P001/instructions/fu-2w" },
  { name: "instructions-fu6w", path: "/patient/P001/instructions/fu-6w" },
  { name: "instructions-fu3m", path: "/patient/P001/instructions/fu-3m" },
  { name: "instructions-fu6m", path: "/patient/P001/instructions/fu-6m" },
  { name: "instructions-fu1y", path: "/patient/P001/instructions/fu-1y" },
  { name: "prom", path: "/patient/P001/prom" },
  { name: "progress", path: "/patient/P001/progress" },
];

for (const pg of pages) {
  test(`screenshot: ${pg.name}`, async ({ page }, testInfo) => {
    await page.goto(pg.path, { waitUntil: "networkidle" });
    // Small delay for animations
    await page.waitForTimeout(500);

    const viewport = testInfo.project.name; // "mobile" or "desktop"
    await page.screenshot({
      path: `screenshots/${viewport}-${pg.name}.png`,
      fullPage: true,
    });
  });
}
