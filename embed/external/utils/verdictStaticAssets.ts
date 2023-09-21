import { appDir, base, staticAssetsPaths } from '../params.js'

export const verdictStaticAssets = ({
  method,
  pathname
}: {
  method: string
  pathname: string
}) => {
  if (method !== 'GET' && method !== 'HEAD') {
    return ''
  }

  if (
    pathname.startsWith(`${base}/${appDir}/`) ||
    staticAssetsPaths.has(pathname)
  ) {
    return pathname
  }

  const extendIndex = `${pathname}index.html`

  if (pathname.endsWith('/') && staticAssetsPaths.has(extendIndex)) {
    return extendIndex
  }

  const extendHtml = `${pathname}.html`

  if (staticAssetsPaths.has(extendHtml)) {
    return extendHtml
  }

  return ''
}
