import { HttpRequest, HttpResponse, WebController } from '@/presentation/controllers/ports'
import { badRequest, forbidden, ok } from '@/presentation/controllers/util'
import { Either } from '@/shared'
import { UserNotFoundError, WrongPasswordError } from '@/use-cases/authentication/errors'
import { AuthenticationResult } from '@/use-cases/authentication/ports'
import { UseCase } from '@/use-cases/ports'

export class SignInController extends WebController {
  constructor (useCase: UseCase) {
    super(useCase)
    super.requiredParams = ['email', 'password']
  }

  async specificOp (request: HttpRequest): Promise<HttpResponse> {
    const response: Either<UserNotFoundError | WrongPasswordError, AuthenticationResult> =
      await this.useCase.perform({ email: request.body.email, password: request.body.password })

    if (response.isRight()) {
      return ok(response.value)
    }

    if (response.value instanceof WrongPasswordError) {
      return forbidden(response.value)
    }

    return badRequest(response.value)
  }
}
