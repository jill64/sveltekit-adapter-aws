import { unfurl } from '@jill64/unfurl'
import { build } from 'esbuild'
import { readFile, writeFile } from 'fs/promises'
import path from 'path'
import { fileURLToPath } from 'url'
import { Context } from '../../types/Context.js'
import { listFiles } from '../../util/listFiles.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export const lambdaMono = async ({ builder, options, tmp, out }: Context) => {
  const assets = path.join(out, 'assets')

  builder.writeClient(assets)
  builder.writePrerendered(assets)
  builder.writeServer(tmp)

  const { list, serverSource } = await unfurl(
    {
      list: listFiles(assets),
      serverSource: readFile(path.join(__dirname, 'mock/server.ts')).then(
        (res) => res.toString()
      )
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
    .map((file) => file.replace(assets, ''))
    .filter((file) => !file.startsWith('/_app/'))

  const convertedServerSource = serverSource.replace(
    '[] /* $$__STATIC_ASSETS_PATHS__$$ */',
    JSON.stringify(staticAssetsPaths)
  )

  const serverEntryPoint = path.join(tmp, 'server.ts')
  await writeFile(serverEntryPoint, convertedServerSource)

  const outfile = path.join(out, 'server.js')
  const shimsSource = path.join(__dirname, 'shims.ts')

  await build({
    format: 'cjs',
    bundle: true,
    minify: true,
    external: ['node:*', '@aws-sdk/*'],
    ...options?.esbuild,
    entryPoints: [serverEntryPoint],
    outfile,
    platform: 'node',
    inject: [shimsSource]
  })
}
