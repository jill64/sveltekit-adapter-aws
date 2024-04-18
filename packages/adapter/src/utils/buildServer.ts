import { build } from 'esbuild'
import path from 'path'
import { Context } from '../types/Context.js'
import { root } from './root.js'

export const buildServer = async (
  { tmp, builder, options }: Context,
  {
    source,
    entryPoint
  }: {
    source: string
    entryPoint: string
  }
) => {
  const entryPointPath = path.join(tmp, entryPoint)

  builder.copy(path.join(root, 'embed', 'arch', source), entryPointPath)

  await build({
    format: 'cjs',
    bundle: true,
    minify: true,
    external: ['node:*', '@aws-sdk/*'],
    ...options?.esbuild,
    entryPoints: [entryPointPath],
    outfile: path.join(options.out, 'lambda', 'server.js'),
    platform: 'node',
    inject: [path.join(root, 'embed', 'shims.ts')]
  })
}
