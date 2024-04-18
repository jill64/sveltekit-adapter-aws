import { LambdaRequestPayload } from '@jill64/types-lambda'
import { generateCanonicalOrigin } from './generateCanonicalOrigin.js'
import { getCloudFrontDomain } from './getCloudFrontDomain.js'

export const rewriteOriginHeader = (
  request: LambdaRequestPayload,
  setOriginHeader: (origin: string) => unknown
) => {
  const { headers } = request
  const cfDomainName = getCloudFrontDomain(headers)

  if (headers.origin === `https://${cfDomainName}`) {
    const origin = generateCanonicalOrigin(request)
    setOriginHeader(origin)
  }
}
