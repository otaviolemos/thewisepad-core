import { UserData } from '@/use-cases/ports'
import { SignUp } from '@/use-cases/sign-up'
import { HttpResponse } from '@/controllers/ports'
import { badRequest, created, forbidden, serverError } from '@/controllers/util'
import { ExistingUserError } from '@/use-cases/sign-up/errors'

export class SignUpController {
  private readonly usecase: SignUp

  constructor (usecase: SignUp) {
    this.usecase = usecase
  }

  async handle (request: UserData): Promise<HttpResponse> {
    try {
      const response = await this.usecase.perform(request)

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
