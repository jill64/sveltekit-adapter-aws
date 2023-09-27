import { domainName } from '../params.js'
import { LambdaIncomingRequest } from '../types/LambdaIncomingRequest.js'
import { generateCanonicalOrigin } from './generateCanonicalOrigin.js'
import { getCloudFrontDomain } from './getCloudFrontDomain.js'

export const rewriteOriginHeader = (
  request: LambdaIncomingRequest,
  setOriginHeader: (origin: string) => unknown
) => {
  const { headers } = request
  const cfDomainName = getCloudFrontDomain(headers)

  if (headers.origin === `https://${domainName ? domainName : cfDomainName}`) {
    const origin = generateCanonicalOrigin(request)
    setOriginHeader(origin)
  }
}
