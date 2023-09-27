import { cdn, domainName } from '../external/params.js'
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
        domainName: lambdaDomainName
      },
      headers,
      rawPath: pathname,
      rawQueryString,
      isBase64Encoded,
      body
    } = request

    if (cdn && isDirectAccess({ request, responseStream, awslambda })) {
      return
    }

    const cfDomainName = headers['via']?.split(' ')?.[1]

    // Rewrite origin header from pre-defined FQDN or CDN
    if (cdn) {
      if (
        headers.origin === `https://${domainName ? domainName : cfDomainName}`
      ) {
        headers.origin = `https://${lambdaDomainName}`
      }
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
      domain: domainName
        ? domainName
        : cfDomainName
        ? cfDomainName
        : lambdaDomainName,
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
