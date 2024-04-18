import path from 'path'
import { Context } from '../types/Context.js'
import { buildEdge } from '../utils/buildEdge.js'
import { buildServer } from '../utils/buildServer.js'
import { writeAssets } from '../utils/writeAssets.js'

export const edgeUnbundled = async (context: Context) => {
  await writeAssets(context, path.join('s3', context.builder.config.kit.paths.base))

  await buildEdge(context, {
    source: path.join('edge-unbundled', 'edge.js'),
    entryPoint: path.join('server', 'edge', 'index.js')
  })

  await buildServer(context, {
    source: path.join('edge-unbundled', `server.js`),
    entryPoint: path.join('server', 'lambda', 'index.js')
  })
}
