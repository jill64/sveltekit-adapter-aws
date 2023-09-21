import { ResponseStream } from '../types/ResponseStream.js'
import { AwsLambda } from '../types/awslambda.js'

export const runStream = ({
  response,
  responseStream,
  awslambda
}: {
  response: Response
  responseStream: ResponseStream
  awslambda: AwsLambda
}) => {
  const responseHeadersEntries = [] as [string, string][]

  response.headers.forEach((value, key) => {
    responseHeadersEntries.push([key, value])
  })

  responseStream = awslambda.HttpResponseStream.from(responseStream, {
    statusCode: response.status,
    headers: Object.fromEntries(responseHeadersEntries)
  })

  if (!response.body) {
    return responseStream.end()
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
