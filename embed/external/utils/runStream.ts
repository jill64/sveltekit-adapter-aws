import type {
  awslambda as AwsLambda,
  ResponseStream
} from '@jill64/types-lambda'
import { qualified } from './qualified.js'

export const runStream = ({
  response,
  responseStream,
  awslambda
}: {
  response: Response
  responseStream: ResponseStream
  awslambda: typeof AwsLambda
}) => {
  const responseHeadersEntries = [] as [string, string][]

  response.headers.forEach((value, key) => {
    responseHeadersEntries.push([key, value])
  })

  responseStream = qualified(responseStream, {
    statusCode: response.status,
    headers: Object.fromEntries(responseHeadersEntries),
    awslambda
  })

  if (!response.body) {
    responseStream.write('')
    responseStream.end()
    return
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

  reader.read().then(readNext)
}
