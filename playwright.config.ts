import { extendsConfig } from '@jill64/playwright-config'
import { env } from 'node:process'

export default extendsConfig({
  use: {
    baseURL: env.CI ? `https://${env.ADAPTER_FQDN}` : 'http://localhost:4173'
  },
  webServer: env.CI
    ? undefined
    : {
        command: 'cd packages/site && pnpm preview',
        port: 4173
      }
})
