import { Middleware } from '@/presentation/middleware/ports'
import { Authentication } from '@/presentation/middleware'
import { makeTokenManager } from '@/main/factories'

export const makeAuthMiddleware = (): Middleware => {
  return new Authentication(makeTokenManager())
}
