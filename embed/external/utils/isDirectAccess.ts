import * as crypto from 'crypto'
import { bridgeAuthToken, domainName } from '../params.js'
import { LambdaIncomingRequest } from '../types/LambdaIncomingRequest.js'
import { ResponseStream } from '../types/ResponseStream.js'
import { AwsLambda } from '../types/awslambda.js'
import { qualified } from './qualified.js'

export const isDirectAccess = ({
  request: { headers, rawPath, rawQueryString },
  responseStream,
  awslambda
}: {
  request: LambdaIncomingRequest
  responseStream: ResponseStream
  awslambda: AwsLambda
}) => {
  const headerStr = headers['bridge-authorization']
  const headerToken = headerStr ? Buffer.from(headerStr) : null
  const token = Buffer.from(`Plain ${bridgeAuthToken}`)

  if (headerToken && crypto.timingSafeEqual(headerToken, token)) {
    return false
  }

  const cfDomainName = headers['via']?.split(' ')?.[1]

  const domain = domainName ? domainName : cfDomainName ? cfDomainName : ''

  responseStream = qualified(
    responseStream,
    domain
      ? {
          awslambda,
          statusCode: 308,
          headers: {
            location: `https://${domain}${rawPath}${
              rawQueryString ? `?${rawQueryString}` : ''
            }`
          }
        }
      : {
          awslambda,
          statusCode: headerToken ? 401 : 403,
          headers: {}
        }
  )

  responseStream.end()

  return true
}
