import type { awslambda as AwsLambda } from '@jill64/types-lambda'
import { domainName } from '../external/params.js'
import { isDirectAccess } from '../external/utils/isDirectAccess.js'
import { respond } from '../external/utils/respond.js'
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
      origin: domainName ? `https://${domainName}` : headers.origin,
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
