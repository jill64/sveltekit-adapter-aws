import { appDir, base, staticAssetsPaths } from '../params.js'

export const verdictStaticAssets = ({
  method,
  path
}: {
  method: string
  path: string
}) => {
  if (method !== 'GET' && method !== 'HEAD') {
    return ''
  }

  if (path.startsWith(`${base}/${appDir}/`) || staticAssetsPaths.has(path)) {
    return path
  }

  const extendIndex = `${path}index.html`

  if (path.endsWith('/') && staticAssetsPaths.has(extendIndex)) {
    return extendIndex
  }

  const extendHtml = `${path}.html`

  if (staticAssetsPaths.has(extendHtml)) {
    return extendHtml
  }

  return ''
}
