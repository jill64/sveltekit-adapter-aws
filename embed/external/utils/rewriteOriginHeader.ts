import { LambdaRequestPayload } from '@jill64/types-lambda'
import { domainName } from '../params.js'
import { generateCanonicalOrigin } from './generateCanonicalOrigin.js'
import { getCloudFrontDomain } from './getCloudFrontDomain.js'

export const rewriteOriginHeader = (
  request: LambdaRequestPayload,
  setOriginHeader: (origin: string) => unknown
) => {
  const { headers } = request
  const cfDomainName = getCloudFrontDomain(headers)

  if (headers.origin === `https://${domainName ? domainName : cfDomainName}`) {
    const origin = generateCanonicalOrigin(request)
    setOriginHeader(origin)
  }
}
