// import path from 'path'
// import type { PropagationArgs } from '../../types/PropagationArgs.js'

// export const edgeBundled = async (args: PropagationArgs) => {
//   const { builder } = args

//   const clientDir = path.join(tmp, 'client')
//   builder.writeClient(clientDir)

//   const preRenderedDir = path.join(tmp, 'pre-rendered')
//   builder.writePrerendered(preRenderedDir)

//   const list = await listFiles(clientDir)

//   const serverSource = readFileSync('./adapter/src/server.ts').toString()
//   const convertedServerSource = serverSource.replace(
//     '[] /* $$__STATIC_ASSETS_PATHS__$$ */',
//     JSON.stringify(list)
//   )

//   await writeFile(
//     path.join(tmp, 'manifest.js'),
//     `export const manifest = ${builder.generateManifest({
//       relativePath: './'
//     })};\n\n`
//   )

//   writeFile(
//     path.join(tmp, 'manifest.js'),
//     `export const manifest = ${builder.generateManifest({
//       relativePath: './'
//     })};\n\n` +
//       `export const prerendered = new Set(${JSON.stringify(
//         builder.prerendered.paths
//       )});\n`
//   )
//   const convertedServerSourcePath = `${tmp}/server.ts`

//   writeFile(convertedServerSourcePath, convertedServerSource)

//   build({
//     entryPoints: [convertedServerSourcePath],
//     outfile: `${out}/server.js`,
//     inject: ['./adapter/src/shims.ts'],
//     external: ['node:*', 'sharp', '@aws-sdk/*'],
//     format: 'cjs',
//     bundle: true,
//     platform: 'node',
//     minify: true
//   })
// }
