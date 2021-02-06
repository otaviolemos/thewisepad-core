import { UserData, UserRepository } from '@/use-cases/ports'
import { SignIn } from '@/use-cases/sign-in'
import { UserBuilder } from '@test/builders'
import { InMemoryUserRepository } from '@test/doubles/repositories'
import { FakeEncoder } from '@test/doubles/encoder'
import { FakeTokenManager } from '@test/doubles/authentication'
import { AuthenticationResult } from '@/use-cases/authentication/ports'
import { CustomAuthentication } from '@/use-cases/authentication'

describe('Sign in use case', () => {
  test('should correctly sign in if password is correct', async () => {
    const singleUserUserRepository = await getSingleUserUserRepository()
    const validUserSigninRequest: UserData = UserBuilder.aUser().build()
    const usecase = new SignIn(new CustomAuthentication(singleUserUserRepository, new FakeEncoder(), new FakeTokenManager()))
    const userResponse = (await (usecase.perform(validUserSigninRequest))).value as AuthenticationResult
    expect(userResponse.id).toEqual(validUserSigninRequest.id)
  })

  test('should not sign in if password is incorrect', async () => {
    const singleUserUserRepository = await getSingleUserUserRepository()
    const usecase = new SignIn(new CustomAuthentication(singleUserUserRepository, new FakeEncoder(), new FakeTokenManager()))
    const signInRequestWithWrongPassword: UserData =
      UserBuilder.aUser().withWrongPassword().build()
    const response = (await (usecase.perform(signInRequestWithWrongPassword))).value as Error
    expect(response.name).toEqual('WrongPasswordError')
  })

  test('should not sign in with unregistered user', async () => {
    const singleUserUserRepository = await getSingleUserUserRepository()
    const usecase = new SignIn(new CustomAuthentication(singleUserUserRepository, new FakeEncoder(), new FakeTokenManager()))
    const signInRequestWithUnregisteredUser: UserData =
      UserBuilder.aUser().withDifferentEmail().build()
    const response = (await (usecase.perform(signInRequestWithUnregisteredUser))).value as Error
    expect(response.name).toEqual('UserNotFoundError')
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
