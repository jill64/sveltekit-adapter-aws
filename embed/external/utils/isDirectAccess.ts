import * as crypto from 'crypto'
import { bridgeAuthToken } from '../params.js'
import { ResponseStream } from '../types/ResponseStream.js'
import { AwsLambda } from '../types/awslambda.js'
import { qualified } from './qualified.js'

export const isDirectAccess = ({
  headers,
  responseStream,
  awslambda
}: {
  headers: Record<string, string>
  responseStream: ResponseStream
  awslambda: AwsLambda
}) => {
  const headerStr = headers['bridge-authorization']
  const headerToken = headerStr ? Buffer.from(headerStr) : null
  const token = Buffer.from(`Plain ${bridgeAuthToken}`)

  if (headerToken && crypto.timingSafeEqual(headerToken, token)) {
    return false
  }

  responseStream = qualified(responseStream, {
    awslambda,
    statusCode: headerToken ? 401 : 403,
    headers: {}
  })

  responseStream.end()

  return true
}
