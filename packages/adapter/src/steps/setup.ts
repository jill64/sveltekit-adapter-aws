import { build } from 'esbuild'
import { writeFile } from 'fs/promises'
import { nanoid } from 'nanoid'
import path from 'path'
import type { Context } from '../types/Context.js'
import { copy } from '../utils/copy.js'
import { root } from '../utils/root.js'

export const setup = async ({ builder, tmp, options }: Context) => {
  const {
    appDir,
    paths: { base }
  } = builder.config.kit

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

  const cdkPath = path.join(root, 'cdk')

  builder.copy(
    path.resolve(cdkPath, 'package.json'),
    path.join(options.out, 'package.json')
  )

  const bridgeAuthToken = nanoid()

  builder.mkdirp(path.join(options.out, 'external'))
  await copy(
    path.join(cdkPath, 'external', 'params.ts'),
    path.join(options.out, 'external', 'params.ts'),
    {
      __APP_DIR__: appDir,
      __BASE_PATH__: base,
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
