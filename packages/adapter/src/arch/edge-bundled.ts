import { writeFile } from 'fs/promises'
import path from 'path'
import { Context } from '../types/Context.js'
import { buildEdge } from '../utils/buildEdge.js'
import { writeAssets } from '../utils/writeAssets.js'

export const edgeBundled = async (context: Context) => {
  const { builder, options } = context

  await writeAssets(context, path.join('s3', builder.config.kit.paths.base))

  await buildEdge(context, {
    source: 'edge-bundled.js',
    entryPoint: path.join('edge', 'index.js')
  })

  // Make .env file
  if (options.env) {
    await writeFile(
      path.join(options.out, 'edge', '.env'),
      Object.entries(options.env).reduce(
        (acc, [key, value]) => `${acc}${key}=${value}\n`,
        ''
      )
    )
  }
}
