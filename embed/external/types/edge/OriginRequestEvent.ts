import { CfConfig } from './CfConfig.js'
import { EdgeRequest } from './EdgeRequest.js'

// https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/lambda-event-structure.html
export type OriginRequestEvent = {
  Records: [
    {
      cf: {
        config: CfConfig
        request: EdgeRequest & {
          origin: {
            custom: {
              customHeaders: Record<string, string>
              domainName: string
            }
          }
        }
      }
    }
  ]
}
