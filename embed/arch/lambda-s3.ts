import type { AwsLambda } from '../external/types/awslambda.js'
import { isDirectAccess } from '../external/utils/isDirectAccess.js'
import { respond } from '../external/utils/respond.js'
import { runStream } from '../external/utils/runStream.js'
import { streamFile } from '../external/utils/streamFile.js'
import { verdictStaticAssets } from '../external/utils/verdictStaticAssets.js'

declare const awslambda: AwsLambda

export const handler = awslambda.streamifyResponse(
  async (request, responseStream) => {
    console.log('request', request)

    const {
      requestContext: {
        http: { method, sourceIp },
        domainName
      },
      headers,
      rawPath: pathname,
      rawQueryString,
      body,
      isBase64Encoded
    } = request

    if (isDirectAccess({ request, responseStream, awslambda })) {
      return
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
      domain: domainName,
      pathname,
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
