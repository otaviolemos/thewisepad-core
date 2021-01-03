import { UserData } from '../../../src/entities/user-data'
import { UserRepository } from '../../../src/use-cases/ports/user-repository'
import { SignIn } from '../../../src/use-cases/sign-in/sign-in'
import { InMemoryUserRepository } from '../in-memory-user-repository'
import { FakeEncoder } from '../sign-up/fake-encoder'

describe('Sign in use case', () => {
  const validEmail = 'any@mail.com'
  const validPassword = '1validpassword'
  const wrongPassword = 'wrongpassword'
  const unregisteredEmail = 'another@mail.com'
  const validUserSigninRequest: UserData = { email: validEmail, password: validPassword }
  const signInRequestWithWrongPassword: UserData = { email: validEmail, password: wrongPassword }
  const signInRequestWithUnregisteredUser: UserData = { email: unregisteredEmail, password: validPassword }
  const userDataArrayWithSingleUser: UserData[] = new Array({ email: validEmail, password: validPassword + 'ENCRYPTED' })
  const singleUserUserRepository: UserRepository = new InMemoryUserRepository(userDataArrayWithSingleUser)

  test('should correctly sign in if password is correct', async () => {
    const usecase = new SignIn(singleUserUserRepository, new FakeEncoder())
    const userResponse = (await (usecase.perform(validUserSigninRequest))).value
    expect(userResponse).toEqual(validUserSigninRequest)
  })

  test('should not sign in if password is incorrect', async () => {
    const usecase = new SignIn(singleUserUserRepository, new FakeEncoder())
    const response = (await (usecase.perform(signInRequestWithWrongPassword))).value as Error
    expect(response.name).toEqual('WrongPasswordError')
  })

  test('should not sign in with unregistered user', async () => {
    const usecase = new SignIn(singleUserUserRepository, new FakeEncoder())
    const response = (await (usecase.perform(signInRequestWithUnregisteredUser))).value as Error
    expect(response.name).toEqual('UserNotFoundError')
  })
})
