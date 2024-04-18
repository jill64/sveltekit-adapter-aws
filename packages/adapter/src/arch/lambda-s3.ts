import { rm } from 'fs/promises'
import path from 'path'
import { Context } from '../types/Context.js'
import { buildServer } from '../utils/buildServer.js'
import { writeAssets } from '../utils/writeAssets.js'

export const lambdaS3 = async (context: Context) => {
  const {
    builder,
    options: { out }
  } = context

  const {
    appDir,
    paths: { base }
  } = builder.config.kit

  await writeAssets(context, path.join('lambda', 'assets'))

  const lambdaApp = path.join(path.join(out, 'lambda', 'assets'), appDir)

  builder.copy(lambdaApp, path.join(out, 's3', base, appDir))
  await rm(lambdaApp, { recursive: true })

  await buildServer(context, {
    source: `lambda-s3.js`,
    entryPoint: path.join('lambda', 'index.js')
  })
}
