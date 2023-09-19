import type { EdgeEvent } from './EdgeEvent'
import type { EdgeRequest } from './EdgeRequest'
import type { EdgeResponse } from './EdgeResponse'

export type EdgeHandler = (
  event: EdgeEvent
) => Promise<EdgeResponse | EdgeRequest>
