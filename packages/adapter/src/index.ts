import type { Adapter } from '@sveltejs/kit'
import { match, P } from 'ts-pattern'
// import { edgeBundled } from './arch/edgeBundled/index.js'
import { lambdaMono } from './arch/lambda-mono/index.js'
// import { lambdaS3 } from './arch/lambdaS3/index.js'
// import { edgeUnbundled } from './arch/edgeUnbundled/index.js'
import path from 'path'
import { deploy } from './deploy/index.js'
import type { AdapterOptions } from './types/AdapterOptions.js'

const name = 'adapter-aws'

const adapter = (options?: AdapterOptions) => {
  const { out = 'build', architecture, deploy: deployStep } = options ?? {}

  return {
    name,
    adapt: async (builder) => {
      builder.rimraf(out)

      const tmp = builder.getBuildDirectory(name)
      builder.rimraf(tmp)

      const client = path.join(out, 'client')
      builder.writeClient(client)

      const prerendered = path.join(out, 'pre-rendered')
      builder.writePrerendered(prerendered)

      await (
        match(architecture)
          // .with('lambda-s3', () => lambdaS3)
          .with('lambda-mono', () => lambdaMono)
          // .with('edge-bundled', () => edgeBundled)
          // .with('edge-unbundled', () => edgeUnbundled)
          .with(P.nullish, () => {
            builder.log.minor(
              `Option 'architecture' is not defined. Use the default value 'lambda-s3'.`
            )
            return null
          })
          .otherwise(() => {
            builder.log.minor(
              `Option 'architecture' is invalid. Use the default value 'lambda-s3'.`
            )
            return null
          }) ??
        // lambdaS3
        lambdaMono
      )({ builder, options, tmp, out, client, prerendered })

      if (deployStep) {
        await deploy(out)
      }

      if (deployStep === undefined) {
        builder.log.minor(
          `Option 'deploy' is not defined. Deploy step is skipped.`
        )
      }
    }
  } satisfies Adapter
}

export default adapter
