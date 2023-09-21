import type { OriginRequestHandler } from '../../external/types/edge/OriginRequestHandler.js'
import { verdictStaticAssets } from '../../external/utils/verdictStaticAssets.js'

export const handler: OriginRequestHandler = async ({
  Records: [
    {
      cf: { request }
    }
  ]
}) => {
  const { uri: pathname, method } = request

  const assetsPath = verdictStaticAssets({
    method,
    pathname
  })

  if (assetsPath) {
    request.uri = assetsPath
    return request
  }

  const lambdaDomain = request.origin.s3.customHeaders['lambda-domain'][0].value

  request.headers['host'][0].value = lambdaDomain

  return {
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
}
