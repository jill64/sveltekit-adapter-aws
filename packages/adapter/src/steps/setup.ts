import { nanoid } from 'nanoid'
import path from 'path'
import type { Context } from '../types/Context.js'
import { copy } from '../utils/copy.js'
import { root } from '../utils/root.js'

export const setup = async ({ builder, tmp, options, out }: Context) => {
  builder.log.minor('Setup...')

  builder.copy(
    path.resolve(root, 'embed', 'external'),
    path.join(tmp, 'external')
  )

  const cdkPath = path.join(root, 'cdk')

  builder.copy(path.resolve(cdkPath, 'cdk.json'), path.join(out, 'cdk.json'))

  builder.copy(
    path.resolve(cdkPath, 'package.json'),
    path.join(out, 'package.json')
  )

  builder.copy(
    path.resolve(cdkPath, 'mock', 'synth.ts'),
    path.join(out, 'bin', 'synth.ts'),
    {
      replace: {
        __CDK_STACK_NAME__: options?.name ?? 'SvelteKit-App-Default'
      }
    }
  )

  const {
    appDir,
    paths: { base }
  } = builder.config.kit

  const bridgeAuthToken = nanoid()

  await copy(
    path.join(cdkPath, 'external', 'params.ts'),
    path.join(out, 'external', 'params.ts'),
    {
      '128 /* $$__MEMORY_SIZE__$$ */': (options?.memory ?? 128).toString(),
      'false /* $$__ENABLE_CDN__$$ */': options?.cdn ? 'true' : 'false',
      __APP_DIR__: appDir,
      __BASE_PATH__: base,
      __BRIDGE_AUTH_TOKEN__: bridgeAuthToken,
      __DOMAIN_NAME__: options?.domain?.fqdn ?? '',
      __CERTIFICATE_ARN__: options?.domain?.certificateArn ?? '',
      '{} /* $$__ENVIRONMENT__$$ */': JSON.stringify(options?.env ?? {})
    }
  )
}
