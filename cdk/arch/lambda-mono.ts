import {
  Stack,
  StackProps,
  aws_cloudfront,
  aws_cloudfront_origins
} from 'aws-cdk-lib'
import * as lambda from 'aws-cdk-lib/aws-lambda'
import { Construct } from 'constructs'

export class CDKStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props)

    const memorySize = 128 /* $$__MEMORY_SIZE__$$ */
    const ENABLE_CDN = false /* $$__ENABLE_CDN__$$ */

    const lambdaURL = new lambda.Function(this, 'Server', {
      runtime: lambda.Runtime.NODEJS_18_X,
      code: lambda.Code.fromAsset('lambda'),
      handler: 'server.handler',
      architecture: lambda.Architecture.ARM_64,
      memorySize
    }).addFunctionUrl({
      authType: lambda.FunctionUrlAuthType.NONE,
      invokeMode: lambda.InvokeMode.RESPONSE_STREAM
    })

    if (ENABLE_CDN) {
      new aws_cloudfront.Distribution(this, 'CloudFront', {
        defaultBehavior: {
          allowedMethods: aws_cloudfront.AllowedMethods.ALLOW_ALL,
          cachePolicy: aws_cloudfront.CachePolicy.CACHING_DISABLED,
          viewerProtocolPolicy:
            aws_cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
          originRequestPolicy: aws_cloudfront.OriginRequestPolicy.ALL_VIEWER,
          origin: new aws_cloudfront_origins.HttpOrigin(lambdaURL.url)
        },
        priceClass: aws_cloudfront.PriceClass.PRICE_CLASS_ALL,
        additionalBehaviors: {
          '/_app/*': {
            allowedMethods: aws_cloudfront.AllowedMethods.ALLOW_GET_HEAD,
            cachePolicy: aws_cloudfront.CachePolicy.CACHING_OPTIMIZED,
            viewerProtocolPolicy:
              aws_cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
            originRequestPolicy: aws_cloudfront.OriginRequestPolicy.ALL_VIEWER,
            origin: new aws_cloudfront_origins.HttpOrigin(lambdaURL.url)
          }
        }
      })
    }
  }
}
