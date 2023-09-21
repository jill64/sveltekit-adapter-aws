import { architectureType } from '../enum/architectureType.js'
import type { ArchitectureType } from '../types/ArchitectureType.js'

export const isArchitectureType = (v: unknown): v is ArchitectureType =>
  architectureType.some((x) => x === v)
