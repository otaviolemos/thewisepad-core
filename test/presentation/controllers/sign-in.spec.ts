import { CustomAuthentication } from '@/use-cases/authentication'
import { AuthenticationResult } from '@/use-cases/authentication/ports'
import { UserData, UserRepository } from '@/use-cases/ports'
import { SignIn } from '@/use-cases/sign-in'
import { SignInController } from '@/presentation/controllers'
import { HttpRequest, HttpResponse } from '@/presentation/controllers/ports'
import { UserBuilder } from '@test/builders'
import { FakeTokenManager } from '@test/doubles/authentication'
import { FakeEncoder } from '@test/doubles/encoder'
import { InMemoryUserRepository } from '@test/doubles/repositories'

describe('Sign in controller', () => {
  test('should return 200 if valid credentials are provided', async () => {
    const singleUserUserRepository = await getSingleUserUserRepository()
    const validUser: UserData = UserBuilder.aUser().build()
    const usecase = new SignIn(new CustomAuthentication(singleUserUserRepository, new FakeEncoder(), new FakeTokenManager()))
    const validUserSignInRequest: HttpRequest = {
      body: {
        email: validUser.email,
        password: validUser.password
      }
    }
    const controller = new SignInController(usecase)
    const response: HttpResponse = await controller.handle(validUserSignInRequest)
    const authResult = response.body as AuthenticationResult
    expect(response.statusCode).toEqual(200)
    expect(authResult.id).toEqual(validUser.id)
    expect(authResult.accessToken).toBeDefined()
  })

  async function getSingleUserUserRepository (): Promise<UserRepository> {
    const aUser = UserBuilder.aUser().build()
    const userDataArrayWithSingleUser: UserData[] =
      new Array({
        email: aUser.email,
        password: await new FakeEncoder().encode(aUser.password),
        id: aUser.id
      })
    return new InMemoryUserRepository(userDataArrayWithSingleUser)
  }
})
