import type { awslambda as AwsLambda } from '@jill64/types-lambda'
import { cdn } from '../external/params.js'
import { generateCanonicalOrigin } from '../external/utils/generateCanonicalOrigin.js'
import { isDirectAccess } from '../external/utils/isDirectAccess.js'
import { respond } from '../external/utils/respond.js'
import { rewriteOriginHeader } from '../external/utils/rewriteOriginHeader.js'
import { runStream } from '../external/utils/runStream.js'
import { streamFile } from '../external/utils/streamFile.js'
import { verdictStaticAssets } from '../external/utils/verdictStaticAssets.js'

declare const awslambda: typeof AwsLambda

export const handler = awslambda.streamifyResponse(
  async (request, responseStream) => {
    console.log('request', request)

    const {
      requestContext: {
        http: { method, sourceIp }
      },
      headers,
      rawPath: pathname,
      rawQueryString,
      isBase64Encoded,
      body
    } = request

    if (cdn) {
      if (isDirectAccess({ request, responseStream, awslambda })) {
        return
      }
      rewriteOriginHeader(request, (origin) => {
        headers.origin = origin
      })
    }

    const assetPath = verdictStaticAssets({
      method,
      pathname
    })

    if (assetPath) {
      return streamFile({
        assetPath,
        responseStream,
        awslambda
      })
    }

    const response = await respond({
      origin: generateCanonicalOrigin(request),
      pathname,
      queryString: rawQueryString,
      method,
      body,
      headers,
      sourceIp,
      isBase64Encoded
    })

    return runStream({
      response,
      responseStream,
      awslambda
    })
  }
)
