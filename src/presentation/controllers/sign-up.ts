import { HttpResponse, WebController, HttpRequest } from '@/presentation/controllers/ports'
import { badRequest, created, forbidden, getMissingParams, serverError } from '@/presentation/controllers/util'
import { ExistingUserError } from '@/use-cases/sign-up/errors'
import { MissingParamError } from '@/presentation/controllers/errors/missing-param-error'
import { UseCase } from '@/use-cases/ports'

export class SignUpController extends WebController {
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

      const response =
        await this.useCase.perform({ email: request.body.email, password: request.body.password })

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
