import path from 'path'
import { nanoid } from 'nanoid'
import { build } from 'esbuild'
import { writeFile } from 'fs/promises'
import { copy } from '../utils/copy.js'
import { root } from '../utils/root.js'
import type { Context } from '../types/Context.js'

export const setup = async ({ builder, tmp, options }: Context) => {
  builder.log.minor('Setup...')

  const utilsPath = path.join(root, 'embed', 'external', 'utils')

  // bundle 'mime-types' for pnpm
  await build({
    format: 'esm',
    bundle: true,
    entryPoints: [path.join(utilsPath, 'lookupMimeTypes.ts')],
    outfile: path.join(utilsPath, 'lookupMimeTypes.js'),
    platform: 'node'
  })

  builder.copy(
    path.resolve(root, 'embed', 'external'),
    path.join(tmp, 'external'),
    {
      filter: (file) => file !== 'params.js'
    }
  )

  const bridgeAuthToken = nanoid()

  builder.mkdirp(path.join(options.out, 'external'))
  await copy(
    path.join(root, 'embed', 'external', 'params.ts'),
    path.join(options.out, 'external', 'params.ts'),
    {
      __APP_DIR__: builder.config.kit.appDir,
      __BASE_PATH__: builder.config.kit.paths.base,
      __BRIDGE_AUTH_TOKEN__: bridgeAuthToken,
    }
  )

  console.log('options.architecture', options.architecture)

  builder.writeServer(tmp)

  await writeFile(
    path.join(tmp, 'manifest.js'),
    `export const manifest = ${builder.generateManifest({
      relativePath: './'
    })};\n\nexport const prerendered = new Set(${JSON.stringify(
      builder.prerendered.paths
    )});\n`
  )
}
