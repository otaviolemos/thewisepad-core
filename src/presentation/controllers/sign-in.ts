import { HttpRequest, HttpResponse, ControllerOperation } from '@/presentation/controllers/ports'
import { badRequest, forbidden, ok } from '@/presentation/controllers/util'
import { Either } from '@/shared'
import { UserNotFoundError, WrongPasswordError } from '@/use-cases/authentication/errors'
import { AuthenticationResult } from '@/use-cases/authentication/ports'
import { UseCase } from '@/use-cases/ports'

export class SignInOperation implements ControllerOperation {
  readonly requiredParams = ['email', 'password']
  private readonly useCase: UseCase

  constructor (useCase: UseCase) {
    this.useCase = useCase
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
