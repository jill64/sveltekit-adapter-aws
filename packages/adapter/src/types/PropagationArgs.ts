import type { Builder } from '@sveltejs/kit'
import type { AdapterOptions } from './AdapterOptions.js'

export type PropagationArgs = {
  builder: Builder
  tmp: string
  out: string
  options: AdapterOptions | undefined
}
