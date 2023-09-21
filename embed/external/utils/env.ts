export const env = Object.fromEntries(
  Object.entries(process.env).map(([key, value]) => [key, value ?? ''])
)
