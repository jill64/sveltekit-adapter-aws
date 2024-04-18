import path from 'path'
import { Context } from '../types/Context.js'
import { buildEdge } from '../utils/buildEdge.js'
import { writeAssets } from '../utils/writeAssets.js'

export const edgeBundled = async (context: Context) => {
  await writeAssets(context, path.join('s3', context.builder.config.kit.paths.base))

  await buildEdge(context, {
    source: 'edge-bundled.js',
    entryPoint: path.join('edge', 'index.js')
  })
}
