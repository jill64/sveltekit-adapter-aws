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
  lambdaRuntime,
  memorySize,
  stream,
  lambdaModifier,
} from '../external/params'

export class CDKStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props)

    const lambdaFunction = new aws_lambda.Function(this, 'Server', {
      runtime:
        lambdaRuntime === 'NODE_18'
          ? aws_lambda.Runtime.NODEJS_18_X
          : lambdaRuntime === 'NODE_20'
            ? aws_lambda.Runtime.NODEJS_20_X
            : aws_lambda.Runtime.NODEJS_LATEST,
      code: aws_lambda.Code.fromAsset('lambda'),
      handler: 'server.handler',
      architecture: aws_lambda.Architecture.ARM_64,
      memorySize,
      timeout: Duration.seconds(30),
      environment
    });
    
    // allow custom modification of CDK lambda function
    lambdaModifier(lambdaFunction);

    const lambdaURL = lambdaFunction.addFunctionUrl({
      authType: aws_lambda.FunctionUrlAuthType.NONE,
      invokeMode: stream
        ? aws_lambda.InvokeMode.RESPONSE_STREAM
        : aws_lambda.InvokeMode.BUFFERED
    })

    const certificate = certificateArn
      ? aws_certificatemanager.Certificate.fromCertificateArn(
          this,
          'CertificateManagerCertificate',
          certificateArn
        )
      : undefined

    const s3 = new aws_s3.Bucket(this, 'Bucket', {
      transferAcceleration: true
    })

    const cf2 = new aws_cloudfront.Function(this, 'CF2', {
      code: aws_cloudfront.FunctionCode.fromFile({
        filePath: 'cf2/index.js'
      })
    })

    const behaviorBase = {
      viewerProtocolPolicy:
        aws_cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
      originRequestPolicy:
        aws_cloudfront.OriginRequestPolicy.ALL_VIEWER_EXCEPT_HOST_HEADER,
      functionAssociations: [
        {
          function: cf2,
          eventType: aws_cloudfront.FunctionEventType.VIEWER_REQUEST
        }
      ]
    }

    const cdn = new aws_cloudfront.Distribution(this, 'CloudFront', {
      domainNames: domainName ? [domainName] : undefined,
      certificate,
      defaultBehavior: {
        ...behaviorBase,
        allowedMethods: aws_cloudfront.AllowedMethods.ALLOW_ALL,
        cachePolicy: aws_cloudfront.CachePolicy.CACHING_DISABLED,
        origin: new aws_cloudfront_origins.HttpOrigin(
          Fn.select(2, Fn.split('/', lambdaURL.url)),
          {
            protocolPolicy: aws_cloudfront.OriginProtocolPolicy.HTTPS_ONLY,
            originSslProtocols: [aws_cloudfront.OriginSslPolicy.TLS_V1_2],
            customHeaders: {
              'Bridge-Authorization': `Plain ${bridgeAuthToken}`
            }
          }
        )
      },
      httpVersion: aws_cloudfront.HttpVersion.HTTP2_AND_3,
      additionalBehaviors: {
        [appPath]: {
          ...behaviorBase,
          origin: new aws_cloudfront_origins.S3Origin(s3)
        }
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
