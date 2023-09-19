import type { Adapter } from '@sveltejs/kit'
import { build, cleanup, deploy, setup } from './steps/index.js'
import type { AdapterOptions } from './types/AdapterOptions.js'

const name = 'adapter-aws'

export const adapter = (options?: AdapterOptions): Adapter => {
  const out = options?.out ?? 'build'

  return {
    name,
    adapt: async (builder) => {
      const tmp = builder.getBuildDirectory(name)

      const context = { builder, options, tmp, out }

      cleanup(context)
      await setup(context)
      await build(context)
      await deploy(context)
    }
  }
}

