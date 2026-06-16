import { defineConfig, devices } from "@playwright/test";

const isCi = Boolean(process.env.CI);
const port = process.env.PLAYWRIGHT_PORT ?? "3000";
const baseURL = `http://127.0.0.1:${port}`;

export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: false,
  workers: 1,
  reporter: [["list"]],
  use: {
    baseURL,
    trace: "on-first-retry"
  },
  webServer: {
    command: isCi ? "npm run start:standalone" : `npm run dev -- --hostname 127.0.0.1 --port ${port}`,
    url: `${baseURL}/zh`,
    reuseExistingServer: !isCi,
    timeout: 120_000
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] }
    }
  ]
});
