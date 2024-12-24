import { build } from 'esbuild'
import { writeFile } from 'fs/promises'
import { nanoid } from 'nanoid'
import path from 'path'
import type { Context } from '../types/Context.js'
import { copy } from '../utils/copy.js'
import { root } from '../utils/root.js'

export const setup = async ({ builder, tmp, options }: Context) => {
  const {
    appDir,
    paths: { base }
  } = builder.config.kit

  builder.log.minor('Setup...')

  const utilsPath = path.join(root, 'embed', 'external', 'utils')

  // bundle 'mime-types' for pnpm
  await build({
    format: 'esm',
    bundle: true,
    entryPoints: [path.join(utilsPath, 'lookupMimeTypes.ts')],
    outfile: path.join(utilsPath, 'lookupMimeTypes.js'),
    platform: 'node'
  })

  builder.copy(
    path.resolve(root, 'embed', 'external'),
    path.join(tmp, 'external'),
    {
      filter: (file) => file !== 'params.js'
    }
  )

  const cdkPath = path.join(root, 'cdk')

  builder.copy(
    path.resolve(cdkPath, 'cdk.json'),
    path.join(options.out, 'cdk.json')
  )

  builder.copy(
    path.resolve(cdkPath, 'package.json'),
    path.join(options.out, 'package.json')
  )

  builder.copy(
    path.resolve(cdkPath, 'mock', 'synth.ts'),
    path.join(options.out, 'bin', 'synth.ts'),
    {
      replace: {
        __CDK_STACK_NAME__: options.name
      }
    }
  )

  const bridgeAuthToken = nanoid()

  builder.mkdirp(path.join(options.out, 'external'))
  await copy(
    path.join(cdkPath, 'external', 'params.ts'),
    path.join(options.out, 'external', 'params.ts'),
    {
      '128 /* $$__MEMORY_SIZE__$$ */': options.memory.toString(),
      'false /* $$__ENABLE_CDN__$$ */': options.cdn.toString(),
      'true /* $$__ENABLE_STREAM__$$ */': options.stream.toString(),
      __APP_DIR__: appDir,
      __BASE_PATH__: base,
      __BRIDGE_AUTH_TOKEN__: bridgeAuthToken,
      __DOMAIN_NAME__: options.domain?.fqdn ?? '',
      __CERTIFICATE_ARN__: options.domain?.certificateArn ?? '',
      __LAMBDA_RUNTIME__: options.runtime ?? 'NODE_LATEST',
      '{} /* $$__ENVIRONMENT__$$ */': JSON.stringify(options.env ?? {})
    }
  )

  await copy(
    path.join(cdkPath, 'external', 'cdk-modifiers.ts'),
    path.join(options.out, 'external', 'cdk-modifiers.ts'),
    {
      '/* $$__ADAPTER_IMPORTS__$$ */': options.adapterImports?.join('\n') ?? '',
      '(lambdaFunction: cdk.aws_lambda.Function) => {} /* $$__LAMBDA_MODIFIER__$$ */':
        options.lambdaModifier?.toString() ??
        '(lambdaFunction: cdk.aws_lambda.Function) => {}'
    }
  )

  console.log('options.architecture', options.architecture)
  builder.copy(
    path.join(root, 'cdk', 'arch', `${options.architecture}.ts`),
    path.join(options.out, 'bin', 'cdk-stack.ts')
  )

  builder.writeServer(tmp)

  await writeFile(
    path.join(tmp, 'manifest.js'),
    `export const manifest = ${builder.generateManifest({
      relativePath: './'
    })};\n\nexport const prerendered = new Set(${JSON.stringify(
      builder.prerendered.paths
    )});\n`
  )

  builder.copy(
    path.join(root, 'cdk', 'external', 'cf2.js'),
    path.join(options.out, 'cf2', 'index.js'),
    {
      replace: {
        __DOMAIN_NAME__: options.domain?.fqdn ?? ''
      }
    }
  )
}
