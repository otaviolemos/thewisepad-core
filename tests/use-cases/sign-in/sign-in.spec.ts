import { UserData } from '../../../src/entities/user-data'
import { UserRepository } from '../../../src/use-cases/ports/user-repository'
import { SignIn } from '../../../src/use-cases/sign-in/sign-in'
import { UserBuilder } from '../builders/user-builder'
import { InMemoryUserRepository } from '../repositories/in-memory-user-repository'
import { FakeEncoder } from '../sign-up/fake-encoder'

describe('Sign in use case', () => {
  test('should correctly sign in if password is correct', async () => {
    const singleUserUserRepository = await getSingleUserUserRepository()
    const validUserSigninRequest: UserData = UserBuilder.aUser().build()
    const usecase = new SignIn(singleUserUserRepository, new FakeEncoder())
    const userResponse = (await (usecase.perform(validUserSigninRequest))).value
    expect(userResponse).toEqual(validUserSigninRequest)
  })

  test('should not sign in if password is incorrect', async () => {
    const singleUserUserRepository = await getSingleUserUserRepository()
    const usecase = new SignIn(singleUserUserRepository, new FakeEncoder())
    const signInRequestWithWrongPassword: UserData =
      UserBuilder.aUser().withWrongPassword().build()
    const response = (await (usecase.perform(signInRequestWithWrongPassword))).value as Error
    expect(response.name).toEqual('WrongPasswordError')
  })

  test('should not sign in with unregistered user', async () => {
    const singleUserUserRepository = await getSingleUserUserRepository()
    const usecase = new SignIn(singleUserUserRepository, new FakeEncoder())
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
        password: await new FakeEncoder().encode(aUser.password)
      })
    return new InMemoryUserRepository(userDataArrayWithSingleUser)
  }
})
