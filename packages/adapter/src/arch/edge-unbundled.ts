import { unfurl } from '@jill64/unfurl'
import { build } from 'esbuild'
import { writeFile } from 'fs/promises'
import { nanoid } from 'nanoid'
import path from 'path'
import { Context } from '../types/Context.js'
import { copy } from '../utils/copy.js'
import { listFiles } from '../utils/listFiles.js'
import { root } from '../utils/root.js'

export const edgeUnbundled = async ({
  builder,
  options,
  tmp,
  out
}: Context) => {
  const {
    appDir,
    paths: { base }
  } = builder.config.kit

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
    .filter((file) => !file.startsWith(`/${appDir}/`))
    .map((file) => path.join(base, file))

  const bridgeAuthToken = nanoid()

  // Copy CDK Stack
  await copy(
    path.join(root, 'cdk/arch/edge-unbundled.ts'),
    path.join(out, 'bin', 'cdk-stack.ts'),
    {
      '128 /* $$__MEMORY_SIZE__$$ */': (options?.memory ?? 128).toString(),
      'false /* $$__ENABLE_CDN__$$ */': options?.cdn ? 'true' : 'false',
      __APP_DIR__: appDir,
      __BASE_PATH__: base,
      __BRIDGE_AUTH_TOKEN__: bridgeAuthToken,
      __DOMAIN_NAME__: options?.domain?.fqdn ?? '',
      __CERTIFICATE_ARN__: options?.domain?.certificateArn ?? '',
      '{} /* $$__ENVIRONMENT__$$ */': JSON.stringify(options?.env ?? {})
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

  const appDirPath = path.join(params, 'appDir.ts')
  builder.copy(
    path.join(root, 'embed', appDirPath),
    path.join(tmp, appDirPath),
    {
      replace: {
        __APP_DIR__: appDir
      }
    }
  )

  const bridgeAuthTokenPath = path.join(params, 'bridgeAuthToken.ts')
  builder.copy(
    path.join(root, 'embed', bridgeAuthTokenPath),
    path.join(tmp, bridgeAuthTokenPath),
    {
      replace: {
        __BRIDGE_AUTH_TOKEN__: bridgeAuthToken
      }
    }
  )

  const serverEntryPoint = path.join(tmp, 'server', 'lambda', 'index.ts')
  builder.copy(
    path.join(root, 'embed/arch/edge-unbundled/server.ts'),
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

  const edgeEntryPoint = path.join(tmp, 'server', 'edge', 'index.ts')
  builder.copy(
    path.join(root, 'embed/arch/edge-unbundled/edge.ts'),
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
