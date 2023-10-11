import { build } from 'cf2-builder'

await build('cf2/src/index.ts', 'cdk/external/cf2.js')
