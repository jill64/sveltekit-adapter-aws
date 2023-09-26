export type CF2Request = {
  uri: string
  querystring: Record<
    string,
    {
      value: string
      multiValue?: {
        value: string
      }[]
    }
  >
  headers: {
    host?: {
      value: string
    }
  }
}
