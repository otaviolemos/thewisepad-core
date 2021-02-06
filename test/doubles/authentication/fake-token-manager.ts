import { Either, right, left } from '@/shared'
import { Payload, TokenManager } from '@/use-cases/authentication/ports'

export class FakeTokenManager implements TokenManager {
  async sign (info: Payload): Promise<string> {
    return info.id + 'token'
  }

  async verify (token: string): Promise<Either<Error, string>> {
    if (token.endsWith('token')) {
      return right(token.substring(0, token.indexOf('token')))
    }
    return left(new Error('Invalid token.'))
  }
}
