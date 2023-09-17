import path from 'path'
import type { Context } from '../types/Context.js'
import { root } from '../utils/root.js'

export const setup = ({ builder, tmp, out }: Context) => {
  builder.log.minor('Setup...')

  builder.copy(path.resolve(root, 'embed/external'), path.join(tmp, 'external'))

  builder.copy(path.resolve(root, 'cdk/cdk.json'), path.join(out, 'cdk.json'))

  builder.copy(
    path.resolve(root, 'cdk/mock/synth.ts'),
    path.join(out, 'bin', 'synth.ts')
  )
}
