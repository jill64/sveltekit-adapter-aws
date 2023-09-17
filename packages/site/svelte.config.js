import { vitePreprocess } from '@sveltejs/kit/vite'
import adapter from '../../dist/index.js'

/** @type {import('@sveltejs/kit').Config} */
const config = {
  preprocess: vitePreprocess(),
  kit: {
    adapter: adapter({
      deploy: true
    })
  }
}

export default config
