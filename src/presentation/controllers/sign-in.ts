import { UseCase } from '@/use-cases/ports'
import { HttpRequest, HttpResponse, WebController } from '@/presentation/controllers/ports'
import { badRequest, ok } from '@/presentation/controllers/util'
import { MissingParamError } from '@/presentation/controllers/errors'

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

    const response = await this.signInUseCase.perform({ email: request.body.email, password: request.body.password })

    if (response.isRight()) {
      return ok(response.value)
    }
  }
}
