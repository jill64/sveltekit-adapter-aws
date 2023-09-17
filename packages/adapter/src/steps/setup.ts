import path from 'path'
import { fileURLToPath } from 'url'
import type { Context } from '../types/Context.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export const setup = ({ builder, tmp, out }: Context) => {
  builder.log.minor('Setup...')

  builder.copy(
    path.resolve(__dirname, '../../embed/external'),
    path.join(tmp, 'external')
  )

  builder.copy(
    path.resolve(__dirname, '../../cdk/cdk.json'),
    path.join(out, 'cdk.json')
  )

  builder.copy(
    path.resolve(__dirname, '../../cdk/mock/synth.ts'),
    path.join(out, 'bin', 'synth.ts')
  )
}
