import { BuildOptions } from 'esbuild'
import type { ArchitectureType } from './ArchitectureType.js'

export type AdapterOptions = {
  /**
   * Build output directory
   * @default 'build'
   */
  out?: string

  /**
   * Architecture type
   * @default 'lambda-mono'
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
   * This option only works with "lambda-mono" or "lambda-s3".
   * @default false
   */
  cdn?: boolean

  /**
   * Environment variables to set in Lambda
   * @default undefined
   */
  env?: Record<string, string>

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
}
