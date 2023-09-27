import { domainName } from '../params.js'
import { LambdaIncomingRequest } from '../types/LambdaIncomingRequest.js'
import { getCloudFrontDomain } from './getCloudFrontDomain.js'

export const rewriteOriginHeader = (
  {
    headers,
    requestContext: { domainName: lambdaDomainName }
  }: LambdaIncomingRequest,
  setOriginHeader: (origin: string) => unknown
) => {
  const cfDomainName = getCloudFrontDomain(headers)
  if (headers.origin === `https://${domainName ? domainName : cfDomainName}`) {
    setOriginHeader(`https://${lambdaDomainName}`)
  }
}
