import type { PlaywrightTestConfig } from '@playwright/test'
import {defineConfig, device} from '@playwright/test'

export default defineConfig( {
  use: {
    baseURL: `https://${process.env.ADAPTER_FQDN}`,
  },
  testDir: "tests",
  retries: process.env.CI ? 2 : 0,
  fullyParallel: true,
  workers: "100%",
  projects: [
    {
      name: "chromium",
      use: devices["Desktop Chrome"],
    },
    {
      name: "firefox",
      use: devices["Desktop Firefox"],
    },
    {
      name: "webkit",
      use: devices["Desktop Safari"],
    },
    {
      name: "Mobile Chrome",
      use: devices["Pixel 5"],
    },
    {
      name: "Mobile Safari",
      use: devices["iPhone 12"],
    },
  ],
});

