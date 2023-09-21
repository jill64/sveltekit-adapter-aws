import { CfConfig } from './CfConfig.js'
import { EdgeRequest } from './EdgeRequest.js'

// https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/lambda-event-structure.html
export type ViewerRequestEvent = {
  Records: [
    {
      cf: {
        config: CfConfig
        request: EdgeRequest
      }
    }
  ]
}
