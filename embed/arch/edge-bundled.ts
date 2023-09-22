import 'dotenv/config.js'
import { domainName } from '../external/params.js'
import { forbiddenHeaderPrefix } from '../external/utils/edge/forbiddenHeaderPrefix.js'
import { forbiddenHeaders } from '../external/utils/edge/forbiddenHeaders.js'
import { respond } from '../external/utils/respond.js'
import { verdictStaticAssets } from '../external/utils/verdictStaticAssets.js'
import { OriginRequestHandler } from '../external/types/edge/OriginRequestHandler.js'

export const handler: OriginRequestHandler = async ({
  Records: [
    {
      cf: {
        config: { distributionDomainName },
        request
      }
    }
  ]
}) => {
  const { uri: pathname, querystring, method, clientIp: sourceIp } = request

  const assetPath = verdictStaticAssets({
    method,
    pathname
  })

  if (assetPath) {
    request.uri = assetPath
    return request
  }

  // Rewrite origin header from pre-defined FQDN
  if (
    domainName &&
    request.headers.origin?.[0]?.value === `https://${domainName}`
  ) {
    request.headers.origin[0].value = `https://${distributionDomainName}`
  }

  const hasBody = method !== 'GET' && method !== 'HEAD'

  const isBase64Encoded = hasBody ? request.body?.encoding === 'base64' : false

  const headers = Object.entries(request.headers).map(
    ([, [{ key, value }]]) => [key, value] satisfies [string, string]
  )

  const response = await respond({
    method,
    body: hasBody ? request.body?.data : undefined,
    headers,
    sourceIp,
    domain: distributionDomainName,
    pathname,
    queryString: querystring,
    isBase64Encoded
  })

  // TODO: If the response header is too long, a 502 error will occur on Gateway, so delete it.
  response.headers.delete('link')

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
