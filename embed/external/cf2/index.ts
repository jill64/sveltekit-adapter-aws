import { CF2RequestEvent } from '../types/cf2/CF2Event.js'
import { CF2Request } from '../types/cf2/CF2Request.js'
import { CF2Response } from '../types/cf2/CF2Response.js'

const domainName = '__DOMAIN_NAME__'

export const handler = ({
  request
}: CF2RequestEvent): CF2Response | CF2Request => {
  const {
    headers: { host },
    uri,
    querystring
  } = request

  const hostName = host?.value

  if (!hostName) {
    return {
      statusCode: 400
    }
  }

  if (hostName === domainName) {
    return request
  }

  const search = querystring
    ? `?${Object.entries(querystring)
        .flatMap(([key, { value, multiValue }]) =>
          [{ value }, ...(multiValue ?? [])].map(
            ({ value }) => `${key}=${value}`
          )
        )
        .join('&')}`
    : ''

  return {
    statusCode: 308,
    headers: {
      location: {
        value: `https://${domainName}${uri}${search}`
      }
    }
  }
}
