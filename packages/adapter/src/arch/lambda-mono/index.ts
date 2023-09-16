import { build } from 'esbuild'
import { writeFile } from 'fs/promises'
import path from 'path'
import { fileURLToPath } from 'url'
import { PropagationArgs } from '../../types/PropagationArgs.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export const lambdaMono = async ({
  builder,
  options,
  tmp,
  out
}: PropagationArgs) => {
  builder.writeServer(tmp)

  await writeFile(
    path.join(tmp, 'manifest.js'),
    `export const manifest = ${builder.generateManifest({
      relativePath: './'
    })};\n\n` +
      `export const prerendered = new Set(${JSON.stringify(
        builder.prerendered.paths
      )});\n`
  )

  const serverSource = path.join(__dirname, 'mock/server.ts')
  const serverEntryPoint = path.join(tmp, 'server.ts')
  builder.copy(serverSource, serverEntryPoint)

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
