import { defineConfig, devices } from "@playwright/test";

const port = Number(process.env.PLAYWRIGHT_PORT || 3000);
const baseURL = `http://localhost:${port}`;

export default defineConfig({
  testDir: "./tests/e2e",
  use: { baseURL, trace: "on-first-retry" },
  webServer: { command: `node node_modules/next/dist/bin/next start --port ${port}`, url: baseURL, reuseExistingServer: true, timeout: 120000, env: { INSIGHTLY_DEMO_ADMIN: "true" } },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
});
