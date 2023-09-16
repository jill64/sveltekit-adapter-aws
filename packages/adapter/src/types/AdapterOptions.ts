import { BuildOptions } from 'esbuild'
import type { ArchitectureType } from './ArchitectureType.js'

export type AdapterOptions = {
  // Build output directory (default: build)
  out?: string

  // Architecture type (default: 'lambda-s3')
  architecture?: ArchitectureType

  // Automatically deploy with SvelteKit build steps (default: false)
  deploy?: boolean

  // Override esbuild options
  esbuild?: BuildOptions

  // // AWS-CDK CloudFormation Stackname (default: AWSAdapterStack-Default)
  // project?: string

  // // Enable CloudFront distribution (default: false)
  // // By enabling this option, static assets are served from a CDN,
  // // which helps reduce the load on your origin and speeds up delivery to your users.
  // // This option is only available for 'lambda-mono' or 'lambda-s3'
  // cloudfront?: boolean

  // // AWS region (default: us-east-1)
  // region?: string

  // // Deploy stage
  // stage?: string

  // FQDN?: string // Full qualified domain name of CloudFront deployment (e.g. demo.example.com)
  // memory?: number
  // LOG_RETENTION_DAYS?: number // Log retention in days of SSR lambda (default 7 days)
  // zoneName?: string // The name of the hosted zone in Route 53 (defaults to the TLD from the FQDN)
}
