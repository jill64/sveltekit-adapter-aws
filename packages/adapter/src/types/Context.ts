import type { Builder } from '@sveltejs/kit'
import type { AdapterOptions } from './AdapterOptions.js'

export type Context = {
  readonly builder: Builder
  readonly tmp: string
  readonly options: AdapterOptions &
    Required<Pick<AdapterOptions, 'out' | 'architecture'>>
}
