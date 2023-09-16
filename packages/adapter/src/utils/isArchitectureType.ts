import { architectureType } from '../enum/architectureType'
import { ArchitectureType } from '../types/ArchitectureType'

export const isArchitectureType = (v: unknown): v is ArchitectureType =>
  architectureType.some((x) => x === v)
