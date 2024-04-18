import { readFile, writeFile } from 'fs/promises'

export const copy = async (
  src: string,
  dist: string,
  replace: Record<string, string>
) => {
  const str = await readFile(src).then((res) => res.toString())

  const convertedStr = Object.entries(replace).reduce(
    (prev, [key, value]) => prev.replace(key, value),
    str
  )

  await writeFile(dist, convertedStr)
}
