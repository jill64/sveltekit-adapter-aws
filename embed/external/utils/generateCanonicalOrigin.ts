import { domainName } from '../params.js'
import { LambdaIncomingRequest } from '../types/LambdaIncomingRequest.js'
import { getCloudFrontDomain } from './getCloudFrontDomain.js'

export const generateCanonicalOrigin = ({
  headers,
  requestContext: { domainName: lambdaDomainName }
}: LambdaIncomingRequest) => {
  const cfDomainName = getCloudFrontDomain(headers)

  const domain = domainName
    ? domainName
    : cfDomainName
    ? cfDomainName
    : lambdaDomainName

  return `https://${domain}`
}
