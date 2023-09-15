import { vitePreprocess } from '@sveltejs/kit/vite'
import adapter from '../../dist/index.js'

/** @type {import('@sveltejs/kit').Config} */
const config = {
  preprocess: vitePreprocess(),
  kit: {
    adapter: adapter({
      architecture: process.env.ADAPTER_ARCHITECTURE
    })
  }
}

export default config
