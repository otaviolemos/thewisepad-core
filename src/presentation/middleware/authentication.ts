import { Middleware } from '@/presentation/middleware/ports'
import { Payload, TokenManager } from '@/use-cases/authentication/ports'
import { HttpResponse } from '@/presentation/controllers/ports'
import { forbidden, ok, serverError } from '@/presentation/controllers/util'

export type AuthRequest = {
  accessToken: string,
  requesterId: string
}

export class Authentication implements Middleware {
  private readonly tokenManager: TokenManager

  constructor (tokenManager: TokenManager) {
    this.tokenManager = tokenManager
  }

  async handle (request: AuthRequest): Promise<HttpResponse> {
    try {
      const { accessToken, requesterId } = request
      if (!accessToken || !requesterId) {
        return forbidden(new Error('Invalid token or requester id.'))
      }

      const decodedTokenOrError = await this.tokenManager.verify(accessToken)
      if (decodedTokenOrError.isLeft()) {
        return forbidden(decodedTokenOrError.value)
      }

      const payload: Payload = decodedTokenOrError.value as Payload

      if (payload.id === requesterId) {
        return ok(payload)
      }

      return forbidden(new Error('User not allowed to perform this operation.'))
    } catch (error) {
      return serverError(error)
    }
  }
}
