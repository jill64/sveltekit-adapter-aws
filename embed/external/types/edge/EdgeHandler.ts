import type { EdgeEvent } from './EdgeEvent.js'
import type { EdgeRequest } from './EdgeRequest.js'
import type { EdgeResponse } from './EdgeResponse.js'

export type EdgeHandler = (
  event: EdgeEvent
) => Promise<EdgeResponse | EdgeRequest>
