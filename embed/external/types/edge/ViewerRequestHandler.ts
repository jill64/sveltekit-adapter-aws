import type { EdgeRequest } from './EdgeRequest.js'
import type { EdgeResponse } from './EdgeResponse.js'
import { ViewerRequestEvent } from './ViewerRequestEvent.js'

export type ViewerRequestHandler = (
  event: ViewerRequestEvent
) => Promise<EdgeResponse | EdgeRequest>
