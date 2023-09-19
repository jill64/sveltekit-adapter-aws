import type { EdgeBodyEncoding } from './EdgeBodyEncoding'
import type { EdgeHeaders } from './EdgeHeaders'

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
