import { HttpRequest, HttpResponse, WebController } from '@/presentation/controllers/ports'
import { badRequest, forbidden, getMissingParams, ok, serverError } from '@/presentation/controllers/util'
import { MissingParamError } from '@/presentation/controllers/errors'
import { Either } from '@/shared'
import { UserNotFoundError, WrongPasswordError } from '@/use-cases/authentication/errors'
import { AuthenticationResult } from '@/use-cases/authentication/ports'
import { UseCase } from '@/use-cases/ports'

export class SignInController extends WebController {
  constructor (useCase: UseCase) {
    super(useCase)
    super.requiredParams = ['email', 'password']
  }

  async handle (request: HttpRequest): Promise<HttpResponse> {
    try {
      const missingParams: string = getMissingParams(request, this.requiredParams)
      if (missingParams) {
        return badRequest(new MissingParamError(missingParams))
      }

      const response: Either<UserNotFoundError | WrongPasswordError, AuthenticationResult> =
        await this.useCase.perform({ email: request.body.email, password: request.body.password })

      if (response.isRight()) {
        return ok(response.value)
      }

      if (response.value instanceof WrongPasswordError) {
        return forbidden(response.value)
      }

      return badRequest(response.value)
    } catch (error) {
      return serverError(error)
    }
  }
}
