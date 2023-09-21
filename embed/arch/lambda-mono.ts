import { cdn } from '../external/params.js'
import type { AwsLambda } from '../external/types/awslambda.js'
import { isDirectAccess } from '../external/utils/isDirectAccess.js'
import { respond } from '../external/utils/respond.js'
import { runStream } from '../external/utils/runStream.js'
import { streamFile } from '../external/utils/streamFile.js'
import { verdictStaticAssets } from '../external/utils/verdictStaticAssets.js'

declare const awslambda: AwsLambda

export const handler = awslambda.streamifyResponse(
  async (request, responseStream) => {
    const {
      requestContext,
      headers,
      rawPath,
      rawQueryString,
      isBase64Encoded
    } = request

    if (cdn && isDirectAccess({ headers, responseStream, awslambda })) {
      return
    }

    const {
      http: { method, sourceIp },
      domainName
    } = requestContext

    const assetPath = verdictStaticAssets({
      method,
      path: rawPath
    })

    if (assetPath) {
      return streamFile({
        assetPath,
        responseStream,
        awslambda
      })
    }

    const url = `https://${domainName}${rawPath}${
      rawQueryString ? `?${rawQueryString}` : ''
    }`

    const response = await respond(
      url,
      {
        method,
        body: request.body,
        headers: request.headers
      },
      {
        sourceIp,
        isBase64Encoded
      }
    )

    // TODO: If the response header is too long, a 502 error will occur on Gateway, so delete it.
    response.headers.delete('link')

    return runStream({
      response,
      responseStream,
      awslambda
    })
  }
)
