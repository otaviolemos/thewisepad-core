import { makeTokenManager } from '@/main/factories'
import { Middleware } from '@/main/middleware/ports'
import { AuthMiddleware } from '@/main/middleware'

export const makeAuthMiddleware = (): Middleware => {
  return new AuthMiddleware(makeTokenManager())
}
