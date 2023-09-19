import type { EdgeBodyEncoding } from './EdgeBodyEncoding.js'
import type { EdgeHeaders } from './EdgeHeaders.js'

export type EdgeRequest = {
  clientIp: string
  headers: EdgeHeaders
  method: string
  querystring: string
  uri: string
  body?: {
    data: string
    encoding: EdgeBodyEncoding
    inputTruncated: boolean
  }
}
