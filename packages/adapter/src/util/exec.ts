import { exec as fn } from 'child_process'
import { promisify } from 'util'

export const exec = promisify(fn)
