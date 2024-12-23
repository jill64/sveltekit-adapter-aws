import { BuildOptions } from 'esbuild'
import type { ArchitectureType } from './ArchitectureType.js'
import { aws_lambda } from 'aws-cdk-lib'

export type AdapterOptions = {
  /**
   * Build output directory
   * @default 'build'
   */
  out?: string

  /**
   * Architecture type
   * @default 'lambda-s3'
   */
  architecture?: ArchitectureType

  /**
   * Automatically deploy with SvelteKit build steps
   * @default false
   */
  deploy?: boolean

  /**
   * Override esbuild options
   * @default undefined
   */
  esbuild?: BuildOptions

  /**
   * AWS-CDK CloudFormation Stack Name
   * @default 'SvelteKit-App-Default'
   */
  name?: string

  /**
   * Lambda memory size [MB]
   * @default 128
   */
  memory?: number

  /**
   * Enable CloudFront distribution.
   * Static assets are served from his CDN, reducing the load on your origin and speeding up delivery to your users.
   * This option only works with "lambda-mono".
   * @default false
   */
  cdn?: boolean

  /**
   * Environment variables to set in Lambda
   * @default undefined
   */
  env?: Record<string, string>

  /**
   * Skip AWS CDK bootstrap step
   * @default false
   */
  skipBootstrap?: boolean

  /**
   * Whether to enable AWS Lambda streaming.
   * @default true
   * @see https://aws.amazon.com/blogs/compute/introducing-aws-lambda-response-streaming
   */
  stream?: boolean

  /**
   * Lambda runtime environment
   * @default 'NODE_LATEST'
   */
  runtime?: 'NODE_LATEST' | 'NODE_20' | 'NODE_18'

  /**
   * Custom domain of CloudFront distribution
   * @default undefined
   */
  domain?: {
    /**
     * FQDN (Full Qualified Domain Name) to set on CloudFront
     * @example 'demo.example.com'
     */
    fqdn: string

    /**
     * ARN of the SSL certificate created with AWS Certificate Manager (ACM).
     * It must be created in the us-east1 region.
     * @example 'arn:aws:acm:us-east1:<accountId>:certificate/<certificateId>'
     */
    certificateArn: string
  }
  /**
   * Adds imports to the adapter params.ts to allow things like `lambdaModifier` 
   * to access types
   * @example ["import { Stack } from 'aws-cdk-lib'"]
   */
  adapterImports?: string[]

  /**
   * Allows custom modifications to the Lambda function during CDK stack creation
   * @param lambdaFunction The Lambda function to modify
   * @example
   * ```ts
   * lambdaModifier: (fn) => {
   *   fn.addEnvironment('CUSTOM_VAR', 'value');
   * }
   * ```
   */
  lambdaModifier?: (lambdaFunction: aws_lambda.Function) => { }
}
