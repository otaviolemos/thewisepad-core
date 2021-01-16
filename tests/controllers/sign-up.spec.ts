import { HttpResponse } from '@/controllers/ports'
import { SignUpController } from '@/controllers/sign-up'
import { Encoder, UserData } from '@/use-cases/ports'
import { SignUp } from '@/use-cases/sign-up'
import { UserBuilder } from '@test/use-cases/builders'
import { InMemoryUserRepository } from '@test/use-cases/repositories'
import { FakeEncoder } from '@test/use-cases/sign-up'

describe('Sign up controller', () => {
  const emptyUserRepository = new InMemoryUserRepository([])
  const encoder: Encoder = new FakeEncoder()
  const signUpUseCase: SignUp = new SignUp(emptyUserRepository, encoder)
  const controller = new SignUpController(signUpUseCase)
  const validUserSignUpRequest = UserBuilder.aUser().build()

  test('should return 200 and registered user when user is successfully signed up', async () => {
    validUserSignUpRequest.id = undefined
    const response: HttpResponse = await controller.handle(validUserSignUpRequest)
    expect(response.statusCode).toEqual(200)
    expect((response.body as UserData).id).toEqual('0')
  })

  test('should return 403 when trying to sign up existing user', async () => {
    await controller.handle(validUserSignUpRequest)
    const response: HttpResponse = await controller.handle(validUserSignUpRequest)
    expect(response.statusCode).toEqual(403)
    expect((response.body as Error).name).toEqual('ExistingUserError')
  })
})
