import { bridgeAuthToken } from '../params.js'
import { ResponseStream } from '../types/ResponseStream.js'
import { AwsLambda } from '../types/awslambda.js'
import { qualified } from './qualified.js'

export const isDirectAccess = ({
  headers,
  responseStream,
  awslambda
}: {
  headers: Record<string, string>
  responseStream: ResponseStream
  awslambda: AwsLambda
}) => {
  if (headers['bridge-authorization'] !== `Plain ${bridgeAuthToken}`) {
    responseStream = qualified(responseStream, {
      awslambda,
      statusCode: 403,
      headers: {}
    })

    responseStream.write('403 Forbidden')
    responseStream.end()

    return true
  }

  return false
}
