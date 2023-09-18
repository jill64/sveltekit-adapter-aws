import {
  CfnOutput,
  Duration,
  Fn,
  Stack,
  StackProps,
  aws_cloudfront,
  aws_cloudfront_origins,
  aws_lambda
} from 'aws-cdk-lib'
import { Construct } from 'constructs'
import { config } from 'dotenv'

export class CDKStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props)

    const memorySize = 128 /* $$__MEMORY_SIZE__$$ */
    const enableCDN = false /* $$__ENABLE_CDN__$$ */
    const base = '__BASE_PATH__'
    const environment = config({ path: '__DOTENV_PATH__' }).parsed ?? {}

    const lambdaURL = new aws_lambda.Function(this, 'Server', {
      runtime: aws_lambda.Runtime.NODEJS_18_X,
      code: aws_lambda.Code.fromAsset('lambda'),
      handler: 'server.handler',
      architecture: aws_lambda.Architecture.ARM_64,
      memorySize,
      timeout: Duration.seconds(30),
      environment
    }).addFunctionUrl({
      authType: aws_lambda.FunctionUrlAuthType.NONE,
      invokeMode: aws_lambda.InvokeMode.RESPONSE_STREAM
    })

    if (enableCDN) {
      const appPath = `${base}/_app/*`

      const originStr = Fn.select(2, Fn.split('/', lambdaURL.url))
      const origin = new aws_cloudfront_origins.HttpOrigin(originStr, {
        protocolPolicy: aws_cloudfront.OriginProtocolPolicy.HTTPS_ONLY,
        originSslProtocols: [aws_cloudfront.OriginSslPolicy.TLS_V1_2],
        customHeaders: {
          'Bridge-Authorization': `Plain __BRIDGE_AUTH_TOKEN__`
        }
      })

      const originRequestPolicy =
        aws_cloudfront.OriginRequestPolicy.ALL_VIEWER_EXCEPT_HOST_HEADER

      const viewerProtocolPolicy =
        aws_cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS

      const cdn = new aws_cloudfront.Distribution(this, 'CloudFront', {
        defaultBehavior: {
          allowedMethods: aws_cloudfront.AllowedMethods.ALLOW_ALL,
          cachePolicy: aws_cloudfront.CachePolicy.CACHING_DISABLED,
          viewerProtocolPolicy,
          originRequestPolicy,
          origin
        },
        httpVersion: aws_cloudfront.HttpVersion.HTTP2_AND_3,
        additionalBehaviors: {
          [appPath]: {
            allowedMethods: aws_cloudfront.AllowedMethods.ALLOW_GET_HEAD,
            cachePolicy: aws_cloudfront.CachePolicy.CACHING_OPTIMIZED,
            viewerProtocolPolicy,
            originRequestPolicy,
            origin
          }
        }
      })

      new CfnOutput(this, 'Deployed URL', {
        description: 'Deployed URL',
        value: Fn.join('', ['https://', cdn.distributionDomainName])
      })
    } else {
      new CfnOutput(this, 'Deployed URL', {
        description: 'Deployed URL',
        value: lambdaURL.url
      })
    }
  }
}
