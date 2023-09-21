import { staticAssetsPaths } from '../../external/params/staticAssetsPaths.js'
import type { OriginRequestHandler } from '../../external/types/edge/OriginRequestHandler.js'

export const handler: OriginRequestHandler = async (event) => {
  const request = event.Records[0].cf.request
  const { uri, method } = request

  console.log('request', JSON.stringify(request, null, 2))

  if (method === 'GET' || method === 'HEAD') {
    const s3Domain =
      request.origin.custom.customHeaders['S3-Domain']?.[0]?.value

    // Handling static asset requests
    if (staticAssetsPaths.has(uri)) {
      request.origin.custom.domainName = s3Domain
      request.headers['host'] = [{ key: 'host', value: s3Domain }]

      console.log('rewrote request', JSON.stringify(request, null, 2))

      return request
    }

    // SSG requests fallback
    if (uri.endsWith('/') && staticAssetsPaths.has(`${uri}index.html`)) {
      request.origin.custom.domainName = s3Domain
      request.headers['host'] = [{ key: 'host', value: s3Domain }]
      request.uri = `${uri}index.html`

      console.log('rewrote request', JSON.stringify(request, null, 2))

      return request
    }

    if (staticAssetsPaths.has(`${uri}.html`)) {
      request.origin.custom.domainName = s3Domain
      request.headers['host'] = [{ key: 'host', value: s3Domain }]
      request.uri = `${uri}.html`

      console.log('rewrote request', JSON.stringify(request, null, 2))

      return request
    }
  }

  return request
}
