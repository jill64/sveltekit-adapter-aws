import { init } from '@jill64/sentry-sveltekit-edge/server'

const { onHandle, onError } = init(
  'https://6a55c18dec92e5a5c7a2c3090df75f00@o4505814639312896.ingest.sentry.io/4506161269047296'
)

export const handle = onHandle(({ resolve, event }) => {
  console.log('handle', event)
  return resolve(event)
})

export const handleError = onError((e) => {
  console.log('error', e)
})
