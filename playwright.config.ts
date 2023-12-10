import { extendsConfig } from '@jill64/playwright-config'

export default extendsConfig({
  use: {
    baseURL: `https://${process.env.ADAPTER_FQDN}`
  }
})
