import { unfurl } from '@jill64/unfurl'
import { build } from 'esbuild'
import { writeFile } from 'fs/promises'
import path from 'path'
import { Context } from '../types/Context.js'
import { copy } from '../utils/copy.js'
import { listFiles } from '../utils/listFiles.js'
import { root } from '../utils/root.js'

export const lambdaMono = async ({ builder, options, tmp, out }: Context) => {
  const assets = path.join(out, 'lambda', 'assets')

  builder.writeClient(assets)
  builder.writePrerendered(assets)

  builder.writeServer(tmp)

  const { list } = await unfurl(
    {
      list: listFiles(assets)
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

  const {
    appDir,
    paths: { base }
  } = builder.config.kit

  const staticAssetsPaths = list
    .map((file) => file.replace(assets, ''))
    .filter((file) => !file.startsWith(`/${appDir}/`))
    .map((file) => path.join(base, file))

  // Copy CDK Stack
  builder.copy(
    path.join(root, 'cdk', 'arch', 'lambda-mono.ts'),
    path.join(out, 'bin', 'cdk-stack.ts')
  )

  await copy(
    path.join(out, 'external', 'params.ts'),
    path.join(tmp, 'external', 'params.ts'),
    {
      '[] /* $$__STATIC_ASSETS_PATHS__$$ */': JSON.stringify(staticAssetsPaths)
    }
  )

  const serverEntryPoint = path.join(tmp, 'server', 'index.ts')
  builder.copy(
    path.join(root, 'embed', 'arch', 'lambda-mono.ts'),
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
    inject: [path.join(root, 'embed/shims.ts')]
  })
}
