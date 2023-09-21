import { ResponseStream } from '../types/ResponseStream.js'
import { AwsLambda } from '../types/awslambda.js'

export const qualified = (
  responseStream: ResponseStream,
  {
    awslambda,
    statusCode,
    headers
  }: {
    statusCode: number
    headers: Record<string, string>
    awslambda: AwsLambda
  }
) =>
  awslambda.HttpResponseStream.from(responseStream, {
    statusCode,
    headers
  })
