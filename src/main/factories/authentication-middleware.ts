import { Middleware } from '@/main/middleware/ports'
import { Authentication } from '@/presentation/middleware'
import { FakeTokenManager } from '@test/doubles/authentication'

export const makeAuthMiddleware = (): Middleware => {
  return new Authentication(new FakeTokenManager())
}
