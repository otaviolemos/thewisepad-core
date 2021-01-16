import { UserData } from '@/use-cases/ports'
import { SignUp } from '@/use-cases/sign-up'
import { HttpResponse } from '@/controllers/ports'
import { forbidden, ok } from '@/controllers/util'
import { ExistingUserError } from '@/use-cases/sign-up/errors'

export class SignUpController {
  private readonly usecase: SignUp

  constructor (usecase: SignUp) {
    this.usecase = usecase
  }

  async handle (request: UserData): Promise<HttpResponse> {
    const response = await this.usecase.perform(request)
    if (response.isRight()) {
      return ok(response.value)
    }

    if (response.isLeft() && response.value instanceof ExistingUserError) {
      return forbidden(response.value)
    }
  }
}
