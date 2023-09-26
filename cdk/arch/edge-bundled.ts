import {
  CfnOutput,
  Duration,
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
  certificateArn,
  domainName,
  memorySize
} from '../external/params'

export class CDKStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props)

    const edge = new aws_cloudfront.experimental.EdgeFunction(this, 'Edge', {
      code: aws_lambda.Code.fromAsset('edge'),
      handler: 'server.handler',
      runtime: aws_lambda.Runtime.NODEJS_18_X,
      timeout: Duration.seconds(30),
      memorySize
    })

    const cf2 = domainName
      ? new aws_cloudfront.Function(this, 'CF2', {
          code: aws_cloudfront.FunctionCode.fromFile({
            filePath: 'cf2/index.js'
          })
        })
      : null

    const s3 = new aws_s3.Bucket(this, 'Bucket')

    const behaviorBase = {
      viewerProtocolPolicy:
        aws_cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
      originRequestPolicy:
        aws_cloudfront.OriginRequestPolicy.ALL_VIEWER_EXCEPT_HOST_HEADER,
      origin: new aws_cloudfront_origins.S3Origin(s3),
      functionAssociations: cf2
        ? [
            {
              function: cf2,
              eventType: aws_cloudfront.FunctionEventType.VIEWER_RESPONSE
            }
          ]
        : []
    }

    const cdn = new aws_cloudfront.Distribution(this, 'CloudFront', {
      domainNames: domainName ? [domainName] : undefined,
      certificate: certificateArn
        ? aws_certificatemanager.Certificate.fromCertificateArn(
            this,
            'CertificateManagerCertificate',
            certificateArn
          )
        : undefined,
      defaultBehavior: {
        ...behaviorBase,
        cachePolicy: aws_cloudfront.CachePolicy.CACHING_DISABLED,
        allowedMethods: aws_cloudfront.AllowedMethods.ALLOW_ALL,
        edgeLambdas: [
          {
            functionVersion: edge,
            eventType: aws_cloudfront.LambdaEdgeEventType.ORIGIN_REQUEST,
            includeBody: true
          }
        ]
      },
      httpVersion: aws_cloudfront.HttpVersion.HTTP2_AND_3,
      additionalBehaviors: {
        [appPath]: behaviorBase
      }
    })

    new aws_s3_deployment.BucketDeployment(this, 'S3Deploy', {
      sources: [aws_s3_deployment.Source.asset('s3')],
      destinationBucket: s3,
      distribution: cdn
    })

    if (domainName) {
      new CfnOutput(this, 'Deployed URL', {
        description: 'Deployed URL',
        value: `https://${domainName}`
      })
    }

    new CfnOutput(this, 'CloudFront URL', {
      description: 'CloudFront URL',
      value: `https://${cdn.distributionDomainName}`
    })
  }
}
