import type { EdgeBodyEncoding } from './EdgeBodyEncoding.js'
import type { EdgeHeaders } from './EdgeHeaders.js'

// https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/lambda-event-structure.html
export type EdgeRequest = {
  readonly clientIp: string
  headers: EdgeHeaders
  readonly method: string
  querystring: string
  uri: string
  body?: {
    action: 'read-only' | 'replace'
    data: string
    encoding: EdgeBodyEncoding
    readonly inputTruncated: boolean
  }
}
