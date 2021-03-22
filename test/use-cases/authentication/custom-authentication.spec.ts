import { CustomAuthentication } from '@/use-cases/authentication/'
import { UserData, UserRepository } from '@/use-cases/ports'
import { FakeEncoder } from '@test/doubles/encoder'
import { FakeTokenManager } from '@test/doubles/authentication/fake-token-manager'
import { UserBuilder } from '@test/builders'
import { InMemoryUserRepository } from '@test/doubles/repositories'
import { AuthenticationResult } from '@/use-cases/authentication/ports'

describe('Custom authenticator', () => {
  test('should correctly authenticate if user email and password is correct', async () => {
    const singleUserUserRepository = await getSingleUserUserRepository()
    const validUserSigninRequest: UserData = UserBuilder.aUser().build()
    const fakeTokenManager = new FakeTokenManager()
    const authentication = new CustomAuthentication(singleUserUserRepository, new FakeEncoder(), fakeTokenManager)
    const response = (await (authentication.auth(validUserSigninRequest))).value as AuthenticationResult
    expect(response.id).toEqual(validUserSigninRequest.id)
    expect((await fakeTokenManager.verify(response.accessToken)).value).toEqual({ id: validUserSigninRequest.id })
  })

  test('should not authenticate if password is incorrect', async () => {
    const singleUserUserRepository = await getSingleUserUserRepository()
    const signInRequestWithWrongPassword: UserData = UserBuilder.aUser().withWrongPassword().build()
    const fakeTokenManager = new FakeTokenManager()
    const authentication = new CustomAuthentication(singleUserUserRepository, new FakeEncoder(), fakeTokenManager)
    const response = (await (authentication.auth(signInRequestWithWrongPassword))).value as Error
    expect(response.name).toEqual('WrongPasswordError')
  })

  test('should not authenticate with unregistered user', async () => {
    const singleUserUserRepository = await getSingleUserUserRepository()
    const signInRequestWithUnregisteredUser: UserData = UserBuilder.aUser().withDifferentEmail().build()
    const fakeTokenManager = new FakeTokenManager()
    const authentication = new CustomAuthentication(singleUserUserRepository, new FakeEncoder(), fakeTokenManager)
    const response = (await (authentication.auth(signInRequestWithUnregisteredUser))).value as Error
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
