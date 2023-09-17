import { error, json, text } from '@sveltejs/kit'

export const POST = () => {
  return text('POST Success')
}

export const PUT = () => {
  return json({
    message: 'PUT Success'
  })
}

export const PATCH = () => {
  throw error(400, 'PATCH Error')
}

export const DELETE = () => {
  throw new Error('DELETE Error')
}
