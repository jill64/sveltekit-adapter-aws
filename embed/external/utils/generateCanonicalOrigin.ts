import { LambdaRequestPayload } from '@jill64/types-lambda'
import { getCloudFrontDomain } from './getCloudFrontDomain.js'

export const generateCanonicalOrigin = ({
  headers,
  requestContext: { domainName: lambdaDomainName }
}: LambdaRequestPayload) => {
  const cfDomainName = getCloudFrontDomain(headers)

  const domain = cfDomainName ? cfDomainName : lambdaDomainName

  return `https://${domain}`
}
