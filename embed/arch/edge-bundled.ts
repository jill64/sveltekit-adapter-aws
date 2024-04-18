import { OriginRequestHandler } from '@jill64/types-lambda'
import 'dotenv/config.js'
import { forbiddenHeaderPrefix } from '../external/utils/edge/forbiddenHeaderPrefix.js'
import { forbiddenHeaders } from '../external/utils/edge/forbiddenHeaders.js'
import { respond } from '../external/utils/respond.js'
import { verdictStaticAssets } from '../external/utils/verdictStaticAssets.js'

export const handler: OriginRequestHandler<'s3', 'include-body'> = async ({
  Records: [
    {
      cf: {
        config: { distributionDomainName },
        request
      }
    }
  ]
}) => {
  console.log('request', request)

  const { uri: pathname, querystring, method, clientIp: sourceIp } = request

  const assetPath = verdictStaticAssets({
    method,
    pathname
  })

  if (assetPath) {
    request.uri = assetPath
    return request
  }

  const hasBody = method !== 'GET' && method !== 'HEAD'

  if (hasBody && request.body?.inputTruncated) {
    return {
      status: '413'
    }
  }

  const isBase64Encoded = hasBody ? request.body?.encoding === 'base64' : false

  const headers = Object.entries(request.headers).map(
    ([, [{ key, value }]]) => [key, value] satisfies [string, string]
  )

  const response = await respond({
    method,
    body: hasBody ? request.body?.data : undefined,
    headers,
    sourceIp,
    origin: `https://${distributionDomainName}`,
    pathname,
    queryString: querystring,
    isBase64Encoded
  })

  const responseHeadersEntries = [] as [string, string][]

  response.headers.forEach((value, key) => {
    if (
      forbiddenHeaderPrefix.some((prefix) =>
        key.toLowerCase().startsWith(prefix)
      ) ||
      forbiddenHeaders.includes(key.toLowerCase())
    ) {
      return
    }

    responseHeadersEntries.push([key, value])
  })

  const responseBase = {
    status: response.status.toString(),
    headers: Object.fromEntries(
      responseHeadersEntries.map(([key, value]) => [
        key.toLowerCase(),
        [{ key, value }]
      ])
    )
  }

  return response.status === 204
    ? responseBase
    : {
        ...responseBase,
        body: await response.text()
      }
}
