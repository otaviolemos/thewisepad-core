import { UserData } from '../../../src/entities/user-data'
import { UserRepository } from '../../../src/use-cases/ports/user-repository'
import { SignIn } from '../../../src/use-cases/sign-in/sign-in'
import { UserBuilder } from '../builders/user-builder'
import { InMemoryUserRepository } from '../repositories/in-memory-user-repository'
import { FakeEncoder } from '../sign-up/fake-encoder'

describe('Sign in use case', () => {
  const aUser =
    UserBuilder
      .aUser()
      .build()
  const userDataArrayWithSingleUser: UserData[] =
    new Array({ email: aUser.email, password: aUser.password + 'ENCRYPTED' })
  const singleUserUserRepository: UserRepository =
    new InMemoryUserRepository(userDataArrayWithSingleUser)

  test('should correctly sign in if password is correct', async () => {
    const validUserSigninRequest: UserData =
      UserBuilder
        .aUser()
        .build()
    const usecase = new SignIn(singleUserUserRepository, new FakeEncoder())
    const userResponse = (await (usecase.perform(validUserSigninRequest))).value
    expect(userResponse).toEqual(validUserSigninRequest)
  })

  test('should not sign in if password is incorrect', async () => {
    const usecase = new SignIn(singleUserUserRepository, new FakeEncoder())
    const signInRequestWithWrongPassword: UserData =
      UserBuilder
        .aUser()
        .build()
    signInRequestWithWrongPassword.password = 'wrongpassword'
    const response = (await (usecase.perform(signInRequestWithWrongPassword))).value as Error
    expect(response.name).toEqual('WrongPasswordError')
  })

  test('should not sign in with unregistered user', async () => {
    const usecase = new SignIn(singleUserUserRepository, new FakeEncoder())
    const signInRequestWithUnregisteredUser: UserData =
      UserBuilder
        .aUser()
        .build()
    signInRequestWithUnregisteredUser.email = 'unregistered@mail.com'
    const response = (await (usecase.perform(signInRequestWithUnregisteredUser))).value as Error
    expect(response.name).toEqual('UserNotFoundError')
  })
})
