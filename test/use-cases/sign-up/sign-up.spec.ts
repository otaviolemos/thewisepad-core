import { Encoder, UserData, UserRepository } from '@/use-cases/ports'
import { SignUp } from '@/use-cases/sign-up'
import { ExistingUserError } from '@/use-cases/sign-up/errors'
import { UserBuilder } from '@test/builders'
import { InMemoryUserRepository } from '@test/doubles/repositories'
import { FakeEncoder } from '@test/doubles/encoder'
import { makeAuthenticationStub } from '@test/use-cases/authentication'
import { AuthenticationResult } from '@/use-cases/authentication/ports'

describe('Sign up use case', () => {
  const authenticationStub = makeAuthenticationStub()

  test('should sign up user with valid data', async () => {
    const emptyUserRepository = new InMemoryUserRepository([])
    const encoder: Encoder = new FakeEncoder()
    const sut: SignUp = new SignUp(emptyUserRepository, encoder, authenticationStub)
    const validUserSignUpRequest =
      UserBuilder
        .aUser()
        .build()
    const userSignUpResponse = (await sut.perform(validUserSignUpRequest))
    expect((userSignUpResponse.value as AuthenticationResult).id).toBeDefined()
    expect((userSignUpResponse.value as AuthenticationResult).accessToken).toBeDefined()
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
    const sut: SignUp = new SignUp(singleUserUserRepository, encoder, authenticationStub)
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
    const sut: SignUp = new SignUp(emptyUserRepository, encoder, authenticationStub)
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
    const sut: SignUp = new SignUp(emptyUserRepository, encoder, authenticationStub)
    const error = await sut.perform(userSignupRequestWithInvalidPassword)
    expect((error.value as Error).name).toEqual('InvalidPasswordError')
  })
})
