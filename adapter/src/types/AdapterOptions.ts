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
   * Override esbuild options
   * @default undefined
   */
  esbuild?: BuildOptions
}
