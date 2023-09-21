import { ResponseStream } from './ResponseStream.js'

export type AwsLambda = {
  streamifyResponse: (
    handler: (
      event: {
        rawPath: string
        rawQueryString: string
        headers: Record<string, string>
        requestContext: {
          domainName: string
          http: {
            method: string
            sourceIp: string
          }
        }
        body: BodyInit
        isBase64Encoded: boolean
      },
      responseStream: ResponseStream
    ) => Promise<void>
  ) => unknown
  HttpResponseStream: {
    from: (
      responseStream: ResponseStream,
      metadata: { statusCode: number; headers: Record<string, string> }
    ) => ResponseStream
  }
}
