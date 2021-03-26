import { HttpResponse, WebController, HttpRequest } from '@/presentation/controllers/ports'
import { badRequest, created, forbidden, getMissingParams, serverError } from '@/presentation/controllers/util'
import { ExistingUserError } from '@/use-cases/sign-up/errors'
import { MissingParamError } from '@/presentation/controllers/errors/missing-param-error'

export class SignUpController extends WebController {
  async handle (request: HttpRequest): Promise<HttpResponse> {
    try {
      const requiredParams = ['email', 'password']
      const missingParams: string = getMissingParams(request, requiredParams)
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
