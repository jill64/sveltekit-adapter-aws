import 'dotenv/config.js'
import { domainName } from '../external/params.js'
import type { ViewerRequestHandler } from '../external/types/edge/ViewerRequestHandler.js'
import { forbiddenHeaderPrefix } from '../external/utils/edge/forbiddenHeaderPrefix.js'
import { forbiddenHeaders } from '../external/utils/edge/forbiddenHeaders.js'
import { respond } from '../external/utils/respond.js'
import { verdictStaticAssets } from '../external/utils/verdictStaticAssets.js'

export const handler: ViewerRequestHandler = async ({
  Records: [
    {
      cf: {
        config: { distributionDomainName },
        request
      }
    }
  ]
}) => {
  const { uri, querystring, method, clientIp: sourceIp } = request

  const assetPath = verdictStaticAssets({
    method,
    path: uri
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

  const url = `https://${distributionDomainName}${uri}${
    querystring ? `?${querystring}` : ''
  }`

  const response = await respond(
    url,
    {
      method,
      body: hasBody ? request.body?.data : undefined,
      headers: Object.entries(request.headers).map(
        ([, [{ key, value }]]) => [key, value] satisfies [string, string]
      )
    },
    {
      sourceIp,
      isBase64Encoded
    }
  )

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
