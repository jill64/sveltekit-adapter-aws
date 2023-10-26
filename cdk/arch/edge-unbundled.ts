import {
  CfnOutput,
  Duration,
  Fn,
  Stack,
  StackProps,
  aws_certificatemanager,
  aws_cloudfront,
  aws_cloudfront_origins,
  aws_lambda,
  aws_s3,
  aws_s3_deployment
} from 'aws-cdk-lib'
import { Construct } from 'constructs'
import {
  appPath,
  bridgeAuthToken,
  certificateArn,
  domainName,
  environment,
  memorySize
} from '../external/params'

export class CDKStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props)

    const timeout = Duration.seconds(30)

    const lambdaURL = new aws_lambda.Function(this, 'Server', {
      runtime: aws_lambda.Runtime.NODEJS_18_X,
      code: aws_lambda.Code.fromAsset('lambda'),
      handler: 'server.handler',
      architecture: aws_lambda.Architecture.ARM_64,
      memorySize,
      timeout,
      environment
    }).addFunctionUrl({
      authType: aws_lambda.FunctionUrlAuthType.NONE,
      invokeMode: aws_lambda.InvokeMode.RESPONSE_STREAM
    })

    const edge = new aws_cloudfront.experimental.EdgeFunction(this, 'Edge', {
      code: aws_lambda.Code.fromAsset('edge'),
      handler: 'server.handler',
      runtime: aws_lambda.Runtime.NODEJS_18_X,
      timeout
    })

    const cf2 = new aws_cloudfront.Function(this, 'CF2', {
      code: aws_cloudfront.FunctionCode.fromFile({
        filePath: 'cf2/index.js'
      })
    })

    const s3 = new aws_s3.Bucket(this, 'Bucket', {
      transferAcceleration: true
    })

    const lambdaOriginStr = Fn.select(2, Fn.split('/', lambdaURL.url))

    const viewerProtocolPolicy =
      aws_cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS
    const originRequestPolicy =
      aws_cloudfront.OriginRequestPolicy.ALL_VIEWER_EXCEPT_HOST_HEADER

    const distribution = new aws_cloudfront.Distribution(this, 'CloudFront', {
      domainNames: domainName ? [domainName] : undefined,
      certificate: certificateArn
        ? aws_certificatemanager.Certificate.fromCertificateArn(
            this,
            'CertificateManagerCertificate',
            certificateArn
          )
        : undefined,
      defaultBehavior: {
        cachePolicy: aws_cloudfront.CachePolicy.CACHING_DISABLED,
        viewerProtocolPolicy,
        originRequestPolicy,
        origin: new aws_cloudfront_origins.S3Origin(s3, {
          customHeaders: {
            'Bridge-Authorization': `Plain ${bridgeAuthToken}`,
            'Lambda-Domain': lambdaOriginStr
          }
        }),
        allowedMethods: aws_cloudfront.AllowedMethods.ALLOW_ALL,
        edgeLambdas: [
          {
            functionVersion: edge,
            eventType: aws_cloudfront.LambdaEdgeEventType.ORIGIN_REQUEST
          }
        ],
        functionAssociations: [
          {
            function: cf2,
            eventType: aws_cloudfront.FunctionEventType.VIEWER_REQUEST
          }
        ]
      },
      httpVersion: aws_cloudfront.HttpVersion.HTTP2_AND_3,
      additionalBehaviors: {
        [appPath]: {
          viewerProtocolPolicy,
          originRequestPolicy,
          origin: new aws_cloudfront_origins.S3Origin(s3),
          functionAssociations: [
            {
              function: cf2,
              eventType: aws_cloudfront.FunctionEventType.VIEWER_REQUEST
            }
          ]
        }
      }
    })

    new aws_s3_deployment.BucketDeployment(this, 'S3Deploy', {
      sources: [aws_s3_deployment.Source.asset('s3')],
      destinationBucket: s3,
      distribution
    })

    if (domainName) {
      new CfnOutput(this, 'Deployed URL', {
        description: 'Deployed URL',
        value: `https://${domainName}`
      })
    }

    new CfnOutput(this, 'CloudFront URL', {
      description: 'CloudFront URL',
      value: `https://${distribution.distributionDomainName}`
    })
  }
}
