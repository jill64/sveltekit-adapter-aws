import { Server } from '../../index.js'
import { manifest } from '../../manifest.js'

export const respond = async (request: {
  domain: string
  pathname: string
  queryString: string
  sourceIp: string
  method: string
  body: BodyInit | null | undefined
  headers: HeadersInit
  isBase64Encoded: boolean
}) => {
  const {
    domain,
    pathname,
    queryString,
    sourceIp,
    isBase64Encoded,
    method,
    headers
  } = request

  const env = Object.fromEntries(
    Object.entries(process.env).map(([key, value]) => [key, value ?? ''])
  )

  const body =
    isBase64Encoded && typeof request.body === 'string'
      ? Buffer.from(request.body, 'base64')
      : request.body

  const app = new Server(manifest)

  await app.init({ env })

  const url = `https://${domain}${pathname}${
    queryString ? `?${decodeURIComponent(queryString)}` : ''
  }`

  const response = await app.respond(
    new Request(url, {
      method,
      body,
      headers
    }),
    {
      getClientAddress: () => sourceIp,
      platform: {
        isBase64Encoded
      }
    }
  )

  return response
}
