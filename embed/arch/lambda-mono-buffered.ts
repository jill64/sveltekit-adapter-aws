import type { LambdaHandler, LambdaResponsePayload } from '@jill64/types-lambda'
import { generateCanonicalOrigin } from '../external/utils/generateCanonicalOrigin.js'
import { isDirectAccess } from '../external/utils/isDirectAccess-buffered.js'
import { provideFile } from '../external/utils/provideFile.js'
import { respond } from '../external/utils/respond.js'
import { rewriteOriginHeader } from '../external/utils/rewriteOriginHeader.js'
import { verdictStaticAssets } from '../external/utils/verdictStaticAssets.js'

export const handler: LambdaHandler = async (payload) => {
  const {
    requestContext: {
      http: { method, sourceIp }
    },
    headers,
    rawPath: pathname,
    rawQueryString,
    isBase64Encoded,
    body
  } = payload

  if (true) {
    const response = isDirectAccess(payload)

    if (response) {
      return response
    }

    rewriteOriginHeader(payload, (origin) => {
      headers.origin = origin
    })
  }

  const assetPath = verdictStaticAssets({
    method,
    pathname
  })

  if (assetPath) {
    return await provideFile(assetPath)
  }

  const response = await respond({
    origin: generateCanonicalOrigin(payload),
    pathname,
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
