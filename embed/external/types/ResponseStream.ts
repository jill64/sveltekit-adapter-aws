export type ResponseStream = WritableStream & {
  write: (chunk: Buffer | Uint8Array | string | null) => void
  end: () => void
  setContentType: (contentType: string) => void
}
