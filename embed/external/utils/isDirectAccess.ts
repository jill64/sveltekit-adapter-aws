import type {
  awslambda as AwsLambda,
  LambdaRequestPayload,
  ResponseStream
} from '@jill64/types-lambda'
import * as crypto from 'crypto'
import { bridgeAuthToken } from '../params.js'
import { qualified } from './qualified.js'

export const isDirectAccess = ({
  request: { headers, rawPath, rawQueryString },
  responseStream,
  awslambda
}: {
  request: LambdaRequestPayload
  responseStream: ResponseStream
  awslambda: typeof AwsLambda
}) => {
  const headerStr = headers['bridge-authorization']
  const headerToken = headerStr ? Buffer.from(headerStr) : null
  const token = Buffer.from(`Plain ${bridgeAuthToken}`)

  if (headerToken && crypto.timingSafeEqual(headerToken, token)) {
    return false
  }

  const cfDomainName = headers['via']?.split(' ')?.[1]

  const domain = cfDomainName ? cfDomainName : ''

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
