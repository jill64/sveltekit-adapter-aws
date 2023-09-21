import { bridgeAuthToken } from '../../external/params.js'
import { awslambda } from '../../external/types/awslambda.js'
import { respond } from '../../external/utils/respond.js'

export const handler = awslambda.streamifyResponse(
  async (request, responseStream) => {
    const {
      requestContext,
      headers,
      rawPath,
      rawQueryString,
      isBase64Encoded
    } = request

    const setResponseHeader = (
      statusCode: number,
      headers: Record<string, string>
    ) => {
      responseStream = awslambda.HttpResponseStream.from(responseStream, {
        statusCode,
        headers
      })
    }

    const closeResponseStream = () => {
      responseStream.write('')
      responseStream.end()
    }

    if (headers['bridge-authorization'] !== `Plain ${bridgeAuthToken}`) {
      setResponseHeader(403, {})
      responseStream.write('403 Forbidden')
      return closeResponseStream()
    }

    const {
      http: { method, sourceIp },
      domainName
    } = requestContext

    const url = `https://${domainName}${rawPath}${
      rawQueryString ? `?${rawQueryString}` : ''
    }`

    const response = await respond(
      url,
      {
        method,
        body: request.body,
        headers: request.headers
      },
      {
        sourceIp,
        isBase64Encoded
      }
    )

    // TODO: If the response header is too long, a 502 error will occur on Gateway, so delete it.
    response.headers.delete('link')

    const responseHeadersEntries = [] as [string, string][]

    response.headers.forEach((value, key) => {
      responseHeadersEntries.push([key, value])
    })

    setResponseHeader(
      response.status,
      Object.fromEntries(responseHeadersEntries)
    )

    if (!response.body) {
      return closeResponseStream()
    }

    const reader = response.body.getReader()

    const readNext = (
      chunk: ReadableStreamReadResult<Uint8Array>
    ): Promise<void> | void => {
      if (chunk.done) {
        return responseStream.end()
      }

      responseStream.write(chunk.value)

      return reader.read().then(readNext)
    }

    return reader.read().then(readNext)
  }
)
