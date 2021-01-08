import { UserData } from '../../../src/entities/ports/user-data'
import { UserRepository } from '../../../src/use-cases/ports/user-repository'
import { InMemoryUserRepository } from '../repositories/in-memory-user-repository'
import { Encoder } from '../../../src/use-cases/ports/encoder'
import { FakeEncoder } from './fake-encoder'
import { SignUp } from '../../../src/use-cases/sign-up/sign-up'
import { ExistingUserError } from '../../../src/use-cases/sign-up/errors/existing-user-error'
import { UserBuilder } from '../builders/user-builder'

describe('Sign up use case', () => {
  test('should sign up user with valid data', async () => {
    const emptyUserRepository = new InMemoryUserRepository([])
    const encoder: Encoder = new FakeEncoder()
    const sut: SignUp = new SignUp(emptyUserRepository, encoder)
    const validUserSignUpRequest =
      UserBuilder
        .aUser()
        .build()
    const userSignUpResponse = (await sut.perform(validUserSignUpRequest))
    expect((userSignUpResponse.value as UserData).email).toEqual(validUserSignUpRequest.email)
    expect((userSignUpResponse.value as UserData).id).not.toBeUndefined()
    expect((await emptyUserRepository.findAll()).length).toEqual(1)
    expect((await emptyUserRepository.findByEmail(validUserSignUpRequest.email)).password).toEqual(validUserSignUpRequest.password + 'ENCRYPTED')
  })

  test('should not sign up existing user', async () => {
    const validUserSignUpRequest =
      UserBuilder
        .aUser()
        .build()
    const userDataArrayWithSingleUser: UserData[] = new Array(validUserSignUpRequest)
    const singleUserUserRepository: UserRepository = new InMemoryUserRepository(userDataArrayWithSingleUser)
    const encoder: Encoder = new FakeEncoder()
    const sut: SignUp = new SignUp(singleUserUserRepository, encoder)
    const error = await sut.perform(validUserSignUpRequest)
    expect(error.value).toEqual(new ExistingUserError(validUserSignUpRequest))
  })

  test('should not sign up user with invalid email', async () => {
    const userSignupRequestWithInvalidEmail: UserData =
      UserBuilder
        .aUser()
        .withInvalidEmail()
        .build()
    const emptyUserRepository = new InMemoryUserRepository([])
    const encoder: Encoder = new FakeEncoder()
    const sut: SignUp = new SignUp(emptyUserRepository, encoder)
    const error = await sut.perform(userSignupRequestWithInvalidEmail)
    expect((error.value as Error).name).toEqual('InvalidEmailError')
  })

  test('should not sign up user with invalid password', async () => {
    const userSignupRequestWithInvalidPassword: UserData =
      UserBuilder
        .aUser()
        .withInvalidPassword()
        .build()
    const emptyUserRepository = new InMemoryUserRepository([])
    const encoder: Encoder = new FakeEncoder()
    const sut: SignUp = new SignUp(emptyUserRepository, encoder)
    const error = await sut.perform(userSignupRequestWithInvalidPassword)
    expect((error.value as Error).name).toEqual('InvalidPasswordError')
  })
})
