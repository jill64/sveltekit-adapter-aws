import { copyFile, mkdir } from 'fs/promises'
import path from 'path'

const arch = '../../dist/arch'
const list = [
  'lambda-mono'
  // 'lambda-s3',
  // 'edge-bundled',
  // 'edge-unbundled'
]

await Promise.all(
  list.map((name) => mkdir(path.join(arch, name, 'mock'), { recursive: true }))
)

await Promise.all([
  ...list.map((name) =>
    copyFile('src/util/shims.ts', path.join(arch, name, 'shims.ts'))
  ),
  ...list.map((name) =>
    copyFile(
      path.join('src/arch', name, 'mock/server.ts'),
      path.join(arch, name, 'mock/server.ts')
    )
  )
])
