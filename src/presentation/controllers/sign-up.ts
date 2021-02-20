import { HttpResponse, WebController, HttpRequest } from '@/presentation/controllers/ports'
import { badRequest, created, forbidden, getMissingParams, serverError } from '@/presentation/controllers/util'
import { ExistingUserError } from '@/use-cases/sign-up/errors'
import { MissingParamError } from '@/presentation/controllers/errors/missing-param-error'
import { UseCase } from '@/use-cases/ports'

export class SignUpController implements WebController {
  protected readonly signUpUseCase: UseCase

  constructor (signUpUseCase: UseCase) {
    this.signUpUseCase = signUpUseCase
  }

  async handle (request: HttpRequest): Promise<HttpResponse> {
    try {
      const missingParams: string[] = getMissingParams(request, ['email', 'password'])
      if (missingParams.length > 0) {
        return badRequest(new MissingParamError(missingParams.join(', ')))
      }

      const response =
        await this.signUpUseCase.perform({ email: request.body.email, password: request.body.password })

      if (response.isRight()) {
        return created(response.value)
      }

      if (response.isLeft()) {
        if (response.value instanceof ExistingUserError) {
          return forbidden(response.value)
        }
        return badRequest(response.value)
      }
    } catch (error) {
      return serverError(error)
    }
  }
}
