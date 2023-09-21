import path from 'path'
import { Context } from '../types/Context.js'
import { buildServer } from '../utils/buildServer.js'
import { writeAssets } from '../utils/writeAssets.js'

export const lambdaMono = async (context: Context) => {
  await writeAssets(context, path.join('lambda', 'assets'))
  await buildServer(context, 'lambda-mono.ts')
}
