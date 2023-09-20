import { unfurl } from '@jill64/unfurl'
import { build } from 'esbuild'
import { writeFile } from 'fs/promises'
import path from 'path'
import { Context } from '../types/Context.js'
import { copy } from '../utils/copy.js'
import { listFiles } from '../utils/listFiles.js'
import { root } from '../utils/root.js'

export const edgeBundled = async ({ builder, options, tmp, out }: Context) => {
  const base = builder.config.kit.paths.base

  const s3Assets = path.join(out, 's3', base)

  builder.writeClient(s3Assets)
  builder.writePrerendered(s3Assets)
  builder.writeServer(tmp)

  const { list } = await unfurl(
    {
      list: listFiles(s3Assets)
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
    .map((file) => file.replace(s3Assets, ''))
    .filter((file) => !file.startsWith('/_app/'))
    .map((file) => path.join(base, file))

  // Copy CDK Stack
  builder.copy(
    path.join(root, 'cdk/arch/edge-bundled.ts'),
    path.join(out, 'bin', 'cdk-stack.ts'),
    {
      replace: {
        __BASE_PATH__: base,
        __DOMAIN_NAME__: options?.domain?.fqdn ?? '',
        __CERTIFICATE_ARN__: options?.domain?.certificateArn ?? ''
      }
    }
  )

  // Embed values
  const params = path.join('external', 'params')
  const staticAssetsPath = path.join(params, 'staticAssetsPaths.ts')

  await copy(
    path.join(root, 'embed', staticAssetsPath),
    path.join(tmp, staticAssetsPath),
    {
      '[] /* $$__STATIC_ASSETS_PATHS__$$ */': JSON.stringify(staticAssetsPaths)
    }
  )

  const basePath = path.join(params, 'base.ts')
  builder.copy(path.join(root, 'embed', basePath), path.join(tmp, basePath), {
    replace: {
      __BASE_PATH__: base
    }
  })

  const domainName = path.join(params, 'domainName.ts')
  builder.copy(
    path.join(root, 'embed', domainName),
    path.join(tmp, domainName),
    {
      replace: {
        __DOMAIN_NAME__: options?.domain?.fqdn ?? ''
      }
    }
  )

  // Make .env file
  if (options?.env) {
    await writeFile(
      path.join(out, 'edge', '.env'),
      Object.entries(options.env).reduce(
        (acc, [key, value]) => `${acc}${key}=${value}\n`,
        ''
      )
    )
  }

  const edgeEntryPoint = path.join(tmp, 'edge', 'index.ts')
  builder.copy(
    path.join(root, 'embed', 'arch', 'edge-bundled.ts'),
    edgeEntryPoint
  )

  await build({
    format: 'cjs',
    bundle: true,
    minify: true,
    external: ['node:*'],
    ...options?.esbuild,
    entryPoints: [edgeEntryPoint],
    outfile: path.join(out, 'edge', 'server.js'),
    platform: 'node',
    inject: [path.join(root, 'embed', 'shims.ts')]
  })
}
