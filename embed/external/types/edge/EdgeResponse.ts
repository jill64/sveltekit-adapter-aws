import type { EdgeBodyEncoding } from './EdgeBodyEncoding.js'
import type { EdgeHeaders } from './EdgeHeaders.js'

export type EdgeResponse = {
  body?: string
  bodyEncoding?: EdgeBodyEncoding
  headers?: EdgeHeaders
  status: string
}
