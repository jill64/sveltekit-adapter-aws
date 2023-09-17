import { readdir } from 'fs/promises'
import path from 'path'

export const listFiles = async (dir: string): Promise<string[]> => {
  const result = await readdir(dir, { withFileTypes: true })

  const list = await Promise.all(
    result.map(async (dirent) => {
      const name = path.join(dir, dirent.name)
      return dirent.isFile() ? name : await listFiles(name)
    })
  )

  return list.flat()
}
