import path from 'path'
import { Context } from '../types/Context.js'
import { buildServer } from '../utils/buildServer.js'
import { writeAssets } from '../utils/writeAssets.js'

export const lambdaS3 = async (context: Context) => {
  await writeAssets(context, path.join('s3', context.builder.config.kit.paths.base))

  await buildServer(context, {
    source: `lambda-s3.js`,
    entryPoint: path.join('lambda', 'index.js')
  })
}
