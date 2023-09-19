import { match, P } from 'ts-pattern'
import { edgeBundled } from '../arch/edge-bundled.js'
import { lambdaMono } from '../arch/lambda-mono.js'
import { lambdaS3 } from '../arch/lambda-s3.js'
// import { edgeUnbundled } from '../arch/edge-unbundled.js'
import type { Context } from '../types/Context.js'

export const build = async (context: Context) => {
  const { builder, options, tmp, out } = context
  const { architecture } = options ?? {}

  const process =
    match(architecture)
      .with('lambda-mono', () => lambdaMono)
      .with('lambda-s3', () => lambdaS3)
      .with('edge-bundled', () => edgeBundled)
      // .with('edge-unbundled', () => edgeUnbundled)
      .with(P.nullish, () => {
        builder.log.minor(
          `Option 'architecture' is not defined. Use the default value 'lambda-mono'.`
        )
        return null
      })
      .otherwise(() => {
        builder.log.warn(
          `Option 'architecture' is invalid. Use the default value 'lambda-mono'.`
        )
        return null
      }) ?? lambdaMono

  builder.log.minor('Building...')

  await process({ builder, options, tmp, out })
}
