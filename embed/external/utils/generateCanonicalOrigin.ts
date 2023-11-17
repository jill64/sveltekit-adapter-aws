import { LambdaRequestPayload } from '@jill64/types-lambda'
import { domainName } from '../params.js'
import { getCloudFrontDomain } from './getCloudFrontDomain.js'

export const generateCanonicalOrigin = ({
  headers,
  requestContext: { domainName: lambdaDomainName }
}: LambdaRequestPayload) => {
  const cfDomainName = getCloudFrontDomain(headers)

  const domain = domainName
    ? domainName
    : cfDomainName
      ? cfDomainName
      : lambdaDomainName

  return `https://${domain}`
}
