import type { Context } from '../types/Context.js'

export const cleanup = ({ builder, out, tmp }: Context) => {
  builder.log.minor('Cleanup...')
  builder.rimraf(out)
  builder.rimraf(tmp)
}
