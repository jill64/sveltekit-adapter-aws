import type { EdgeBodyEncoding } from './EdgeBodyEncoding'
import type { EdgeHeaders } from './EdgeHeaders'

export type EdgeResponse = {
  body?: string
  bodyEncoding?: EdgeBodyEncoding
  headers?: EdgeHeaders
  status: string
}
