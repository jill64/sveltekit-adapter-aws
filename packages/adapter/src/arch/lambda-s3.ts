import { unfurl } from '@jill64/unfurl'
import { build } from 'esbuild'
import { rm, writeFile } from 'fs/promises'
import path from 'path'
import { Context } from '../types/Context.js'
import { copy } from '../utils/copy.js'
import { listFiles } from '../utils/listFiles.js'
import { root } from '../utils/root.js'

export const lambdaS3 = async ({ builder, options, tmp, out }: Context) => {
  const lambdaAssets = path.join(out, 'lambda', 'assets')

  builder.writeClient(lambdaAssets)
  builder.writePrerendered(lambdaAssets)

  const {
    appDir,
    paths: { base }
  } = builder.config.kit

  const lambdaApp = path.join(lambdaAssets, appDir)

  builder.copy(lambdaApp, path.join(out, 's3', base, appDir))

  await rm(lambdaApp, { recursive: true })

  builder.writeServer(tmp)

  const { list } = await unfurl(
    {
      list: listFiles(lambdaAssets)
    },
    writeFile(
      path.join(tmp, 'manifest.js'),
      `export const manifest = ${builder.generateManifest({
        relativePath: './'
      })};\n\n` +
        `export const prerendered = new Set(${JSON.stringify(
          builder.prerendered.paths
        )});\n`
    )
  )

  const staticAssetsPaths = list
    .map((file) => file.replace(lambdaAssets, ''))
    .map((file) => path.join(base, file))

  // Copy CDK Stack
  builder.copy(
    path.join(root, 'cdk', 'arch', 'lambda-s3.ts'),
    path.join(out, 'bin', 'cdk-stack.ts')
  )

  // Embed values
  await copy(
    path.join(out, 'external', 'params.ts'),
    path.join(tmp, 'external', 'params.ts'),
    {
      '[] /* $$__STATIC_ASSETS_PATHS__$$ */': JSON.stringify(staticAssetsPaths)
    }
  )

  const serverEntryPoint = path.join(tmp, 'server', 'index.ts')
  builder.copy(
    path.join(root, 'embed', 'arch', 'lambda-s3.ts'),
    serverEntryPoint
  )

  await build({
    format: 'cjs',
    bundle: true,
    minify: true,
    external: ['node:*', '@aws-sdk/*'],
    ...options?.esbuild,
    entryPoints: [serverEntryPoint],
    outfile: path.join(out, 'lambda', 'server.js'),
    platform: 'node',
    inject: [path.join(root, 'embed', 'shims.ts')]
  })
}
