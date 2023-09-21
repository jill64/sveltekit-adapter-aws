import type { Adapter } from '@sveltejs/kit'
import { match } from 'ts-pattern'
import { edgeBundled } from './arch/edge-bundled.js'
import { edgeUnbundled } from './arch/edge-unbundled.js'
import { lambdaMono } from './arch/lambda-mono.js'
import { lambdaS3 } from './arch/lambda-s3.js'
import { deploy } from './steps/deploy.js'
import { setup } from './steps/setup.js'
import type { AdapterOptions } from './types/AdapterOptions.js'

const name = 'adapter-aws'

export const adapter = (options?: AdapterOptions): Adapter => {
  return {
    name,
    adapt: async (builder) => {
      const tmp = builder.getBuildDirectory(name)

      const context = {
        builder,
        options: {
          out: 'build',
          architecture: 'lambda-mono' as const,
          name: 'SvelteKit-App-Default',
          memory: 128,
          deploy: false,
          cdn: false,
          ...options
        },
        tmp
      }

      builder.rimraf(context.options.out)
      builder.rimraf(tmp)

      await setup(context)

      const process = match(context.options.architecture)
        .with('lambda-mono', () => lambdaMono)
        .with('lambda-s3', () => lambdaS3)
        .with('edge-bundled', () => edgeBundled)
        .with('edge-unbundled', () => edgeUnbundled)
        .exhaustive()

      builder.log.minor('Building...')

      await process(context)

      await deploy(context)
    }
  }
}
