import type { Builder } from '@sveltejs/kit'
import type { AdapterOptions } from './AdapterOptions.js'

export type PropagationArgs = {
  builder: Builder
  tmp: string
  out: string
  client: string
  prerendered: string
  options: AdapterOptions | undefined
}
