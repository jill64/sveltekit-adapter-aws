import { vitePreprocess } from '@sveltejs/vite-plugin-svelte'
import adapter from '../../dist/index.js'
import { Stack } from 'aws-cdk-lib'

/** @type {import('@sveltejs/kit').Config} */
const config = {
  preprocess: vitePreprocess(),
  kit: {
    adapter: adapter({
      name: process.env.ADAPTER_ARCHITECTURE
        ? `${process.env.ADAPTER_ARCHITECTURE}-preview-site${process.env.BUFFERED_RESPONSE === 'TRUE' ? '-buffered' : ''}${
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
      skipBootstrap: process.env.CI,
      env: {
        KEY1: 'VALUE1',
        KEY2: 'VALUE2',
        KEY3: 'VALUE3'
      },
      stream: process.env.BUFFERED_RESPONSE !== 'TRUE',
      adapterImports: [ "import { Stack } from 'aws-cdk-lib'" ],
      lambdaModifier: (fn) => {
        const stack = Stack.of(fn)
        fn.addEnvironment("abc", "def")
      }
    })
  }
}

export default config
