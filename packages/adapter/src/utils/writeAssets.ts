import path from 'path'
import { Context } from '../types/Context.js'
import { copy } from '../utils/copy.js'
import { listFiles } from '../utils/listFiles.js'

export const writeAssets = async (
  { builder, options, tmp }: Context,
  assets: string
) => {
  const assetsPath = path.join(options.out, assets)

  builder.writeClient(assetsPath)
  builder.writePrerendered(assetsPath)

  const list = await listFiles(assetsPath)

  const {
    appDir,
    paths: { base }
  } = builder.config.kit

  const staticAssetsPaths = list
    .map((file) => file.replace(assetsPath, ''))
    .filter((file) => !file.replaceAll(path.sep, '/').startsWith(`/${appDir}/`))
    .map((file) => path.join(base, file).replaceAll(path.sep, '/'))

  await copy(
    path.join(options.out, 'external', 'params.ts'),
    path.join(tmp, 'external', 'params.ts'),
    {
      '[] /* $$__STATIC_ASSETS_PATHS__$$ */': JSON.stringify(staticAssetsPaths)
    }
  )

  return staticAssetsPaths
}
