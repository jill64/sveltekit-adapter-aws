import type {
  awslambda as AwsLambda,
  ResponseStream
} from '@jill64/types-lambda'

export const qualified = (
  responseStream: ResponseStream,
  {
    awslambda,
    statusCode,
    headers,
    cookies
  }: {
    statusCode: number
    headers: Record<string, string>
    cookies?: string[]
    awslambda: typeof AwsLambda
  }
) =>
  awslambda.HttpResponseStream.from(responseStream, {
    statusCode,
    headers,
    cookies
  })
