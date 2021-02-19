import { UseCase } from '@/use-cases/ports'
import { HttpRequest, HttpResponse, WebController } from '@/presentation/controllers/ports'
import { badRequest, ok } from '@/presentation/controllers/util'
import { MissingParamError } from '@/presentation/controllers/errors'
import { Either } from '@/shared'
import { UserNotFoundError, WrongPasswordError } from '@/use-cases/authentication/errors'
import { AuthenticationResult } from '@/use-cases/authentication/ports'

export class SignInController implements WebController {
  protected readonly signInUseCase: UseCase

  constructor (signInUseCase: UseCase) {
    this.signInUseCase = signInUseCase
  }

  async handle (request: HttpRequest): Promise<HttpResponse> {
    if (!(request.body.email) || !(request.body.password)) {
      let missingParam = !(request.body.email) ? 'email ' : ''
      missingParam += !(request.body.password) ? 'password' : ''
      return badRequest(new MissingParamError(missingParam.trim()))
    }

    const response: Either<UserNotFoundError | WrongPasswordError, AuthenticationResult> =
      await this.signInUseCase.perform({ email: request.body.email, password: request.body.password })

    if (response.isRight()) {
      return ok(response.value)
    }
  }
}
