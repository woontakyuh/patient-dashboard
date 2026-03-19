import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./e2e",
  timeout: 30000,
  use: {
    baseURL: "http://localhost:3000",
  },
  webServer: {
    command: "npm run dev",
    url: "http://localhost:3000",
    reuseExistingServer: true,
    timeout: 30000,
  },
  projects: [
    {
      name: "mobile",
      use: { viewport: { width: 375, height: 812 } },
    },
    {
      name: "desktop",
      use: { viewport: { width: 1280, height: 900 } },
    },
  ],
});
