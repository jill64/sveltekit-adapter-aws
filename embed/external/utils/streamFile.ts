import type {
  awslambda as AwsLambda,
  ResponseStream
} from '@jill64/types-lambda'
import { createReadStream } from 'fs'
import path from 'path'
import { base } from '../params.js'
import { lookupMimeTypes } from './lookupMimeTypes.js'
import { qualified } from './qualified.js'

export const streamFile = ({
  assetPath,
  responseStream,
  awslambda
}: {
  assetPath: string
  responseStream: ResponseStream
  awslambda: typeof AwsLambda
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
