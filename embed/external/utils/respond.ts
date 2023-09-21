import { Server } from '../../index.js'
import { manifest } from '../../manifest.js'

export const respond = async (
  input: RequestInfo | URL,
  init: RequestInit,
  {
    sourceIp,
    isBase64Encoded
  }: {
    sourceIp: string
    isBase64Encoded: boolean
  }
) => {
  const env = Object.fromEntries(
    Object.entries(process.env).map(([key, value]) => [key, value ?? ''])
  )

  const app = new Server(manifest)

  await app.init({ env })

  const response = await app.respond(new Request(input, init), {
    getClientAddress: () => sourceIp,
    platform: { isBase64Encoded }
  })

  return response
}
