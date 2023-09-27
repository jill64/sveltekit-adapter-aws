import { domainName } from '../../external/params.js'
import type { AwsLambda } from '../../external/types/awslambda.js'
import { isDirectAccess } from '../../external/utils/isDirectAccess.js'
import { respond } from '../../external/utils/respond.js'
import { runStream } from '../../external/utils/runStream.js'

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
      rawPath,
      rawQueryString,
      isBase64Encoded,
      body
    } = request

    if (isDirectAccess({ request, responseStream, awslambda })) {
      return
    }

    const cfDomainName = headers['via']?.split(' ')?.[1]

    // Rewrite origin header from pre-defined FQDN or CDN
    if (
      headers.origin === `https://${domainName ? domainName : cfDomainName}`
    ) {
      headers.origin = `https://${lambdaDomainName}`
    }

    const response = await respond({
      domain: domainName
        ? domainName
        : cfDomainName
        ? cfDomainName
        : lambdaDomainName,
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
