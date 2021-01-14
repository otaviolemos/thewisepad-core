import { HttpResponse } from '@/controllers/ports'
import { SignUpController } from '@/controllers/sign-up'
import { Encoder, UserData } from '@/use-cases/ports'
import { SignUp } from '@/use-cases/sign-up'
import { UserBuilder } from '@test/use-cases/builders'
import { InMemoryUserRepository } from '@test/use-cases/repositories'
import { FakeEncoder } from '@test/use-cases/sign-up'

describe('Sign up controller', () => {
  test('should return 200 and registered user when user is successfully signed up', async () => {
    const emptyUserRepository = new InMemoryUserRepository([])
    const encoder: Encoder = new FakeEncoder()
    const usecase: SignUp = new SignUp(emptyUserRepository, encoder)
    const validUserSignUpRequest = UserBuilder.aUser().build()
    const controller = new SignUpController(usecase)
    const response: HttpResponse = await controller.handle(validUserSignUpRequest)
    expect(response.statusCode).toEqual(200)
    expect((response.body as UserData).id).toEqual('0')
  })
})
