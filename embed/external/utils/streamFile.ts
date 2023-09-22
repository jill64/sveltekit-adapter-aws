import { createReadStream } from 'fs'
import { lookupMimeTypes } from './lookupMimeTypes.js'
import path from 'path'
import { base } from '../params.js'
import { ResponseStream } from '../types/ResponseStream.js'
import { AwsLambda } from '../types/awslambda.js'
import { qualified } from './qualified.js'

export const streamFile = ({
  assetPath,
  responseStream,
  awslambda
}: {
  assetPath: string
  responseStream: ResponseStream
  awslambda: AwsLambda
}) => {
  const filePath = assetPath.replace(base, '')
  const type = lookupMimeTypes(filePath)

  responseStream = qualified(responseStream, {
    awslambda,
    statusCode: 200,
    headers: {
      'content-type': type ? type : 'application/octet-stream'
    }
  })

  const src = createReadStream(path.join(process.cwd(), 'assets', filePath))

  src.on('data', (chunk) => responseStream.write(chunk))
  src.on('end', () => responseStream.end())
}
