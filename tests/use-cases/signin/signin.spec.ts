import { UserData } from '../../../src/entities/user-data'
import { UserRepository } from '../../../src/use-cases/ports/user-repository'
import { WrongPasswordError } from '../../../src/use-cases/signin/errors/wrong-password-error'
import { Signin } from '../../../src/use-cases/signin/signin'
import { InMemoryUserRepository } from '../in-memory-user-repository'
import { FakeEncoder } from '../signup/fake-encoder'

describe('Signin use case', () => {
  const validEmail = 'any@mail.com'
  const validPassword = '1validpassword'
  const wrongPassword = 'wrongpassword'
  const validUserSigninRequest: UserData = { email: validEmail, password: validPassword }
  const invalidUserSigninRequest: UserData = { email: validEmail, password: wrongPassword }
  const userDataArrayWithSingleUser: UserData[] = new Array({ email: validEmail, password: validPassword + 'ENCRYPTED' })
  const singleUserUserRepository: UserRepository = new InMemoryUserRepository(userDataArrayWithSingleUser)

  test('should correctly signin if password is correct', async () => {
    const usecase = new Signin(singleUserUserRepository, new FakeEncoder())
    const userResponse = (await (usecase.perform(validUserSigninRequest))).value
    expect(userResponse).toEqual(validUserSigninRequest)
  })

  test('should not signin if password is incorrect', async () => {
    const usecase = new Signin(singleUserUserRepository, new FakeEncoder())
    const response = (await (usecase.perform(invalidUserSigninRequest))).value as WrongPasswordError
    expect(response.name).toEqual('WrongPasswordError')
  })
})
