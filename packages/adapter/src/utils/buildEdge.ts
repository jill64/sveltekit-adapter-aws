import { build } from 'esbuild'
import path from 'path'
import { Context } from '../types/Context.js'
import { root } from './root.js'

export const buildEdge = async (
  { tmp, builder, options }: Context,
  {
    source,
    entryPoint
  }: {
    source: string
    entryPoint: string
  }
) => {
  const edgeEntryPoint = path.join(tmp, entryPoint)

  builder.copy(path.join(root, 'embed', 'arch', source), edgeEntryPoint)

  await build({
    format: 'cjs',
    bundle: true,
    minify: true,
    external: ['node:*', '@aws-sdk/*'],
    ...options?.esbuild,
    entryPoints: [edgeEntryPoint],
    outfile: path.join(options.out, 'edge', 'server.js'),
    platform: 'node',
    inject: [path.join(root, 'embed', 'shims.ts')]
  })
}
