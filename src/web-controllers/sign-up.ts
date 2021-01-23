import { HttpResponse, WebController, HttpRequest } from '@/web-controllers/ports'
import { badRequest, created, forbidden, serverError } from '@/web-controllers/util'
import { ExistingUserError } from '@/use-cases/sign-up/errors'
import { UseCase } from '@/use-cases/ports'
import { MissingParamError } from '@/web-controllers/errors/missing-param-error'

export class SignUpController implements WebController {
  private readonly usecase: UseCase

  constructor (usecase: UseCase) {
    this.usecase = usecase
  }

  async handle (request: HttpRequest): Promise<HttpResponse> {
    try {
      if (!(request.body.email) || !(request.body.password)) {
        let missingParam = !(request.body.email) ? 'email ' : ''
        missingParam += !(request.body.password) ? 'password' : ''
        return badRequest(new MissingParamError(missingParam.trim()))
      }

      const response =
        await this.usecase.perform({ email: request.body.email, password: request.body.password })

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
