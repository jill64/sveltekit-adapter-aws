import type { LambdaResponsePayload } from '@jill64/types-lambda'
import { readFile } from 'fs/promises'
import path from 'path'
import { base } from '../params.js'
import { lookupMimeTypes } from './lookupMimeTypes.js'

export const provideFile = async (
  assetPath: string
): Promise<LambdaResponsePayload> => {
  const filePath = assetPath.replace(base, '')
  const type = lookupMimeTypes(filePath)

  const body = await readFile(
    path.join(process.cwd(), 'assets', filePath),
    'utf-8'
  )

  return {
    statusCode: 200,
    body,
    headers: {
      'content-type': type ? type : 'application/octet-stream'
    }
  }
}
