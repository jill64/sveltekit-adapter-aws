import { CfConfig } from './CfConfig.js'
import { EdgeHeaders } from './EdgeHeaders.js'
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
              customHeaders: EdgeHeaders
              domainName: string
              path: string
            }
          }
        }
      }
    }
  ]
}
