import { EdgeRequest } from './EdgeRequest.js'

export type EdgeEvent = {
  Records: [
    {
      cf: {
        config: {
          distributionDomainName: string
        }
        request: EdgeRequest
      }
    }
  ]
}
