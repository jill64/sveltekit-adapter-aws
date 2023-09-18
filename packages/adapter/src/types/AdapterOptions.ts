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
   * This option only works with "lambda-mono" or "lambda-s3".
   * @default false
   */
  cdn?: boolean
}
