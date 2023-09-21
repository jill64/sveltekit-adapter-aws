import type { EdgeBodyEncoding } from './EdgeBodyEncoding.js'
import type { EdgeHeaders } from './EdgeHeaders.js'

// https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/lambda-event-structure.html
export type EdgeResponse = {
  body?: string
  bodyEncoding?: EdgeBodyEncoding
  headers?: EdgeHeaders
  status: string
}
