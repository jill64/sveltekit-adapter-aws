import { Server } from '../../index.js'
import { manifest } from '../../manifest.js'

export const respond = async ({
  domain,
  pathname,
  queryString,
  sourceIp,
  isBase64Encoded,
  method,
  body,
  headers
}: {
  domain: string
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

  const app = new Server(manifest)

  await app.init({ env })

  const url = `https://${domain}${pathname}${
    queryString ? `?${queryString}` : ''
  }`

  const response = await app.respond(
    new Request(url, {
      method,
      body,
      headers
    }),
    {
      getClientAddress: () => sourceIp,
      platform: { isBase64Encoded }
    }
  )

  return response
}
