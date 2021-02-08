import { Middleware } from '@/main/middleware/ports'
import { AccessDeniedError } from '@/use-cases/authentication/errors'
import { Payload, TokenManager } from '@/use-cases/authentication/ports'
import { MissingParamError } from '@/web-controllers/errors'
import { HttpResponse } from '@/web-controllers/ports'
import { forbidden, ok, serverError } from '@/web-controllers/util'
import { adaptMiddleware } from '@/main/adapters'
import { makeAuthMiddleware } from '@/main/factories'

export type AuthRequest = {
  accessToken: string
}

export class AuthMiddleware implements Middleware {
  private readonly tokenManager: TokenManager

  constructor (tokenManager: TokenManager) {
    this.tokenManager = tokenManager
  }

  async handle (request: AuthRequest): Promise<HttpResponse> {
    try {
      const { accessToken } = request
      if (!accessToken) {
        return forbidden(new MissingParamError('accessToken'))
      }

      if (accessToken) {
        const decodedTokenOrError = await this.tokenManager.verify(accessToken)
        if (decodedTokenOrError.isLeft()) {
          return forbidden(decodedTokenOrError.value)
        }
        return ok({ id: (decodedTokenOrError.value as Payload).id })
      }
      return forbidden(new AccessDeniedError())
    } catch (error) {
      return serverError(error)
    }
  }
}

export const auth = adaptMiddleware(makeAuthMiddleware())
