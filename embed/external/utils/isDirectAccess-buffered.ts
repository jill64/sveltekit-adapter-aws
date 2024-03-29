import type {
  LambdaRequestPayload,
  LambdaResponsePayload
} from '@jill64/types-lambda'
import * as crypto from 'crypto'
import { bridgeAuthToken, domainName } from '../params.js'

export const isDirectAccess = (
  payload: LambdaRequestPayload
): LambdaResponsePayload | false => {
  const { headers, rawPath, rawQueryString } = payload

  const headerStr = headers['bridge-authorization']
  const headerToken = headerStr ? Buffer.from(headerStr) : null
  const token = Buffer.from(`Plain ${bridgeAuthToken}`)

  if (headerToken && crypto.timingSafeEqual(headerToken, token)) {
    return false
  }

  const cfDomainName = headers['via']?.split(' ')?.[1]

  const domain = domainName ? domainName : cfDomainName ? cfDomainName : ''

  if (domain) {
    return {
      statusCode: 308,
      headers: {
        location: `https://${domain}${rawPath}${
          rawQueryString ? `?${rawQueryString}` : ''
        }`
      }
    }
  }

  return {
    statusCode: headerToken ? 401 : 403,
    headers: {}
  }
}
