import { vitePreprocess } from '@sveltejs/kit/vite'
import adapter from '../../dist/index.js'

/** @type {import('@sveltejs/kit').Config} */
const config = {
  preprocess: vitePreprocess(),
  kit: {
    adapter: adapter({
      name: process.env.ADAPTER_ARCHITECTURE
        ? `${process.env.ADAPTER_ARCHITECTURE}-preview-site${
            process.env.STAGE === 'prod' ? '' : '-dev'
          }`
        : undefined,
      architecture: process.env.ADAPTER_ARCHITECTURE,
      deploy: process.env.CI,
      memory: 256,
      cdn: true,
      ...(process.env.STAGE === 'prod'
        ? {
            domain: {
              fqdn: process.env.ADAPTER_FQDN,
              certificateArn: process.env.ADAPTER_CERTIFICATE_ARN
            }
          }
        : {}),
      env: {
        KEY1: 'VALUE1',
        KEY2: 'VALUE2',
        KEY3: 'VALUE3'
      }
    })
  }
}

export default config
