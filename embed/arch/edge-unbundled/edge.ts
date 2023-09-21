import { staticAssetsPaths } from '../../external/params.js'
import type { OriginRequestHandler } from '../../external/types/edge/OriginRequestHandler.js'

export const handler: OriginRequestHandler = async (event) => {
  const request = event.Records[0].cf.request
  const { uri, method } = request

  console.log('request', JSON.stringify(request, null, 2))

  if (method === 'GET' || method === 'HEAD') {
    // Handling static asset requests
    if (staticAssetsPaths.has(uri)) {
      return request
    }

    // SSG requests fallback
    if (uri.endsWith('/') && staticAssetsPaths.has(`${uri}index.html`)) {
      request.uri = `${uri}index.html`
      return request
    }

    if (staticAssetsPaths.has(`${uri}.html`)) {
      request.uri = `${uri}.html`
      return request
    }
  }

  const lambdaDomain = request.origin.s3.customHeaders['lambda-domain'][0].value

  request.headers['host'][0].value = lambdaDomain

  const rewroteRequest = {
    ...request,
    origin: {
      custom: {
        customHeaders: request.origin.s3.customHeaders,
        domainName: lambdaDomain,
        keepaliveTimeout: 5,
        path: '',
        port: 443,
        protocol: 'https',
        readTimeout: 30,
        sslProtocols: ['TLSv1.2']
      }
    }
  }

  console.log('rewrote request', JSON.stringify(rewroteRequest, null, 2))

  return rewroteRequest
}
