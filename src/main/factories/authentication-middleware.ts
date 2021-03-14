import { Middleware } from '@/presentation/middleware/ports'
import { Authentication } from '@/presentation/middleware'
import { JwtTokenManager } from '@/external/token-manager'

export const makeAuthMiddleware = (): Middleware => {
  return new Authentication(new JwtTokenManager(process.env.JWT_SECRET))
}
