import type { LambdaHandler, LambdaResponsePayload } from '@jill64/types-lambda'
import { generateCanonicalOrigin } from '../../external/utils/generateCanonicalOrigin.js'
import { isDirectAccess } from '../../external/utils/isDirectAccess-buffered.js'
import { respond } from '../../external/utils/respond.js'
import { rewriteOriginHeader } from '../../external/utils/rewriteOriginHeader.js'

export const handler: LambdaHandler = async (payload) => {
  const {
    requestContext: {
      http: { method, sourceIp }
    },
    headers,
    rawPath,
    rawQueryString,
    isBase64Encoded,
    body
  } = payload

  if (isDirectAccess(payload)) {
    return
  }

  rewriteOriginHeader(payload, (origin) => {
    headers.origin = origin
  })

  const response = await respond({
    origin: generateCanonicalOrigin(payload),
    pathname: rawPath,
    queryString: rawQueryString,
    method,
    body,
    headers,
    sourceIp,
    isBase64Encoded
  })

  return {
    statusCode: response.status,
    headers: Object.fromEntries(response.headers),
    body: await response.text()
  } satisfies LambdaResponsePayload
}
