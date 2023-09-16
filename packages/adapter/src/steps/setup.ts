import path from 'path'
import type { Context } from '../types/Context.js'

export const setup = ({ builder, tmp, out }: Context) => {
  builder.log.minor('Setup...')

  builder.copy('../embed/external', path.join(tmp, 'external'))
  builder.copy('../cdk/cdk.json', path.join(out, 'cdk.json'))
  builder.copy('../cdk/mock/synth.ts', path.join(out, 'bin', 'synth.ts'))
}
