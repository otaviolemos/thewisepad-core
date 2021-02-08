import { UseCase } from '@/use-cases/ports'
import { HttpRequest, HttpResponse, WebController } from '@/web-controllers/ports'
import { ok } from '@/web-controllers/util'

export class SignInController implements WebController {
  protected readonly signInUseCase: UseCase

  constructor (signInUseCase: UseCase) {
    this.signInUseCase = signInUseCase
  }

  async handle (request: HttpRequest): Promise<HttpResponse> {
    const response = await this.signInUseCase.perform({ email: request.body.email, password: request.body.password })

    if (response.isRight()) {
      return ok(response.value)
    }
  }
}
