import { EdgeRequest } from './EdgeRequest'

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
