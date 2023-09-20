import type { EdgeRequest } from './EdgeRequest.js'
import { OriginRequestEvent } from './OriginRequestEvent.js'

export type OriginRequestHandler = (
  event: OriginRequestEvent
) => Promise<EdgeRequest>
