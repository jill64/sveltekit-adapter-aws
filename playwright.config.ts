import type { PlaywrightTestConfig } from '@playwright/test'

const config: PlaywrightTestConfig = {
  use: {
    baseURL: `https://${process.env.ADAPTER_FQDN}`
  },
  testDir: 'tests',
  testMatch: /(.+\.)?(test|spec)\.[jt]s/,
  fullyParallel: true,
  workers: '100%'
}

export default config
