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

  const base = builder.config.kit.paths.base

  const staticAssetsPaths = list
    .map((file) => file.replace(assets, ''))
    .filter((file) => !file.startsWith('/_app/'))
    .map((file) => path.join(base, file))

  // Copy CDK Stack
  await copy(
    path.join(root, 'cdk/arch/lambda-mono.ts'),
    path.join(out, 'bin', 'cdk-stack.ts'),
    {
      '128 /* $$__MEMORY_SIZE__$$ */': (options?.memory ?? 128).toString(),
      'false /* $$__ENABLE_CDN__$$ */': options?.cdn ? 'true' : 'false',
      __BASE_PATH__: base
    }
  )

  // Embed values
  const params = path.join('external', 'params')
  const staticAssetsPath = path.join(params, 'staticAssetsPaths.ts')
  const basePath = path.join(params, 'base.ts')

  await copy(
    path.join(root, 'embed', staticAssetsPath),
    path.join(tmp, staticAssetsPath),
    {
      '[] /* $$__STATIC_ASSETS_PATHS__$$ */': JSON.stringify(staticAssetsPaths)
    }
  )

  builder.copy(path.join(root, 'embed', basePath), path.join(tmp, basePath), {
    replace: {
      __BASE_PATH__: base
    }
  })

  const serverEntryPoint = path.join(tmp, 'server', 'index.ts')
  builder.copy(path.join(root, 'embed/arch/lambda-mono.ts'), serverEntryPoint)

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
