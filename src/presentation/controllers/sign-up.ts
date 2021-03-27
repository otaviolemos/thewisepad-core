import { HttpResponse, HttpRequest, ControllerOperation } from '@/presentation/controllers/ports'
import { badRequest, created, forbidden } from '@/presentation/controllers/util'
import { ExistingUserError } from '@/use-cases/sign-up/errors'
import { UseCase } from '@/use-cases/ports'

export class SignUpController implements ControllerOperation {
  requiredParams = ['email', 'password']
  private useCase: UseCase

  constructor (useCase: UseCase) {
    this.useCase = useCase
  }

  async specificOp (request: HttpRequest): Promise<HttpResponse> {
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
  }
}
