import { Server } from '../../index.js'
import { manifest } from '../../manifest.js'

export const respond = async ({
  origin,
  pathname,
  queryString,
  body,
  sourceIp,
  isBase64Encoded,
  method,
  headers
}: {
  origin: string
  pathname: string
  queryString: string
  sourceIp: string
  method: string
  body: BodyInit | null | undefined
  headers: HeadersInit
  isBase64Encoded: boolean
}) => {
  const env = Object.fromEntries(
    Object.entries(process.env).map(([key, value]) => [key, value ?? ''])
  )

  const convertedBody =
    isBase64Encoded && typeof body === 'string'
      ? Buffer.from(body, 'base64')
      : body

  const app = new Server(manifest)

  await app.init({ env })

  const url = `${origin}${pathname}${
    queryString ? `?${decodeURIComponent(queryString)}` : ''
  }`

  const response = await app.respond(
    new Request(url, {
      method,
      body: convertedBody,
      headers
    }),
    {
      getClientAddress: () => sourceIp
    }
  )

  return response
}
