import type { AwsLambda } from '../../external/types/awslambda.js'
import { generateCanonicalOrigin } from '../../external/utils/generateCanonicalOrigin.js'
import { isDirectAccess } from '../../external/utils/isDirectAccess.js'
import { respond } from '../../external/utils/respond.js'
import { rewriteOriginHeader } from '../../external/utils/rewriteOriginHeader.js'
import { runStream } from '../../external/utils/runStream.js'

declare const awslambda: AwsLambda

export const handler = awslambda.streamifyResponse(
  async (request, responseStream) => {
    console.log('request', request)

    const {
      requestContext: {
        http: { method, sourceIp }
      },
      headers,
      rawPath,
      rawQueryString,
      isBase64Encoded,
      body
    } = request

    if (isDirectAccess({ request, responseStream, awslambda })) {
      return
    }

    rewriteOriginHeader(request, (origin) => {
      headers.origin = origin
    })

    const response = await respond({
      origin: generateCanonicalOrigin(request),
      pathname: rawPath,
      queryString: rawQueryString,
      method,
      body,
      headers,
      sourceIp,
      isBase64Encoded
    })

    // TODO: If the response header is too long, a 502 error will occur on Gateway, so delete it.
    response.headers.delete('link')

    return runStream({
      response,
      responseStream,
      awslambda
    })
  }
)
