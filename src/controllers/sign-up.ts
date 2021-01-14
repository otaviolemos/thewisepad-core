import { UserData } from '@/use-cases/ports'
import { SignUp } from '@/use-cases/sign-up'
import { HttpResponse } from '@/controllers/ports'
import { ok } from '@/controllers/util'

export class SignUpController {
  private readonly usecase: SignUp

  constructor (usecase: SignUp) {
    this.usecase = usecase
  }

  async handle (request: UserData): Promise<HttpResponse> {
    const response = await this.usecase.perform(request)
    if (response.isRight()) {
      return ok(request)
    }
  }
}
