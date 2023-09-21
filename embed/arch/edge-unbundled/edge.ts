import type { OriginRequestHandler } from '../../external/types/edge/OriginRequestHandler.js'
import { verdictStaticAssets } from '../../external/utils/verdictStaticAssets.js'

export const handler: OriginRequestHandler = async ({
  Records: [
    {
      cf: { request }
    }
  ]
}) => {
  const { uri, method } = request

  console.log('request', JSON.stringify(request, null, 2))

  const assetsPath = verdictStaticAssets({
    method,
    path: uri
  })

  if (assetsPath) {
    request.uri = assetsPath
    return request
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
