import { UserData } from '../../../src/entities/user-data'
import { UserRepository } from '../../../src/use-cases/ports/user-repository'
import { InMemoryUserRepository } from '../in-memory-user-repository'
import { Encoder } from '../../../src/use-cases/signup/ports/encoder'
import { FakeEncoder } from './fake-encoder'
import { Signup } from '../../../src/use-cases/signup/signup'
import { ExistingUserError } from '../../../src/use-cases/signup/errors/existing-user-error'

describe('Signup use case', () => {
  const validEmail = 'any@mail.com'
  const validPassword = '1validpassword'
  const invalidEmail = 'invalid_email'
  const invalidPassword = '1abc'
  const validUserSignupRequest: UserData = { email: validEmail, password: validPassword }
  const emptyUserRepository: UserRepository = new InMemoryUserRepository([])
  const userDataArrayWithSingleUser: UserData[] = new Array(validUserSignupRequest)
  const singleUserUserRepository: UserRepository = new InMemoryUserRepository(userDataArrayWithSingleUser)
  const encoder: Encoder = new FakeEncoder()

  test('should signup user with valid data', async () => {
    const sut: Signup = new Signup(emptyUserRepository, encoder)
    const userSignupResponse = (await sut.perform(validUserSignupRequest))
    expect((userSignupResponse.value as UserData).email).toEqual(validEmail)
    expect((userSignupResponse.value as UserData).email).not.toBeUndefined()
    expect((await emptyUserRepository.findAllUsers()).length).toEqual(1)
    expect((await emptyUserRepository.findUserByEmail(validEmail)).password).toEqual(validPassword + 'ENCRYPTED')
  })

  test('should not signup existing user', async () => {
    const sut: Signup = new Signup(singleUserUserRepository, encoder)
    const error = await sut.perform(validUserSignupRequest)
    expect(error.value).toEqual(new ExistingUserError(validUserSignupRequest))
  })

  test('should not signup user with invalid email', async () => {
    const userSignupRequestWithInvalidEmail: UserData = { email: invalidEmail, password: validPassword }
    const sut: Signup = new Signup(emptyUserRepository, encoder)
    const error = await sut.perform(userSignupRequestWithInvalidEmail)
    expect((error.value as Error).name).toEqual('InvalidEmailError')
  })

  test('should not signup user with invalid password', async () => {
    const userSignupRequestWithInvalidPassword: UserData = { email: validEmail, password: invalidPassword }
    const sut: Signup = new Signup(emptyUserRepository, encoder)
    const error = await sut.perform(userSignupRequestWithInvalidPassword)
    expect((error.value as Error).name).toEqual('InvalidPasswordError')
  })
})
