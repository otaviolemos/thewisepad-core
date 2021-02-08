import { Middleware } from '@/main/middleware/ports'
import { AuthMiddleware } from '@/main/middleware'
import { FakeTokenManager } from '@test/doubles/authentication'

export const makeAuthMiddleware = (): Middleware => {
  return new AuthMiddleware(new FakeTokenManager())
}
