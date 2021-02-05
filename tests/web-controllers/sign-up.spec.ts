import { HttpRequest, HttpResponse } from '@/web-controllers/ports'
import { SignUpController } from '@/web-controllers/sign-up'
import { InvalidEmailError, InvalidPasswordError } from '@/entities/errors'
import { Encoder, UserData, UseCase } from '@/use-cases/ports'
import { SignUp } from '@/use-cases/sign-up'
import { ExistingUserError } from '@/use-cases/sign-up/errors'
import { UserBuilder } from '@test/use-cases/builders'
import { InMemoryUserRepository } from '@test/use-cases/repositories'
import { FakeEncoder } from '@test/use-cases/encoders'
import { MissingParamError } from '@/web-controllers/errors'
import { AuthenticationParams, AuthenticationResult, AuthenticationService } from '@/use-cases/authentication/ports'
import { Either, right } from '@/shared'
import { UserNotFoundError, WrongPasswordError } from '@/use-cases/authentication/errors'

describe('Sign up controller', () => {
  const emptyUserRepository = new InMemoryUserRepository([])
  const encoder: Encoder = new FakeEncoder()
  class AuthenticationServiceStub implements AuthenticationService {
    async auth (authenticationParams: AuthenticationParams): Promise<Either<UserNotFoundError | WrongPasswordError, AuthenticationResult>> {
      return right({
        accessToken: 'accessToken',
        id: UserBuilder.aUser().build().id
      })
    }
  }
  const authenticationStub = new AuthenticationServiceStub()
  const signUpUseCase: UseCase = new SignUp(emptyUserRepository, encoder, authenticationStub)
  const controller = new SignUpController(signUpUseCase)
  const validUser = UserBuilder.aUser().build()
  const validUserSignUpRequest: HttpRequest = {
    body: {
      email: validUser.email,
      password: validUser.password
    }
  }
  const userWithInvalidEmail = UserBuilder.aUser().withInvalidEmail().build()
  const userSignupRequestWithInvalidEmail: HttpRequest = {
    body: {
      email: userWithInvalidEmail.email,
      password: userWithInvalidEmail.password
    }
  }
  const userWithInvalidPassword = UserBuilder.aUser().withInvalidPassword().build()
  const userSignupRequestWithInvalidPassword: HttpRequest = {
    body: {
      email: userWithInvalidPassword.email,
      password: userWithInvalidPassword.password
    }
  }
  class ErrorThrowingSignUpUseCaseStub implements UseCase {
    async perform (request: UserData): Promise<void> {
      throw Error()
    }
  }
  const errorThrowingSignUpUseCaseStub: ErrorThrowingSignUpUseCaseStub = new ErrorThrowingSignUpUseCaseStub()

  test('should return 201 and authentication result when user is successfully signed up', async () => {
    const response: HttpResponse = await controller.handle(validUserSignUpRequest)
    const authResult = response.body as AuthenticationResult
    expect(response.statusCode).toEqual(201)
    expect(authResult.id).toEqual('0')
    expect(authResult.accessToken).toBeDefined()
  })

  test('should return 403 when trying to sign up existing user', async () => {
    await controller.handle(validUserSignUpRequest)
    const response: HttpResponse = await controller.handle(validUserSignUpRequest)
    expect(response.statusCode).toEqual(403)
    expect(response.body).toBeInstanceOf(ExistingUserError)
  })

  test('should return 400 when trying to sign up user with invalid email', async () => {
    const response: HttpResponse = await controller.handle(userSignupRequestWithInvalidEmail)
    expect(response.statusCode).toEqual(400)
    expect(response.body).toBeInstanceOf(InvalidEmailError)
  })

  test('should return 400 when trying to sign up user with invalid password', async () => {
    const response: HttpResponse = await controller.handle(userSignupRequestWithInvalidPassword)
    expect(response.statusCode).toEqual(400)
    expect(response.body).toBeInstanceOf(InvalidPasswordError)
  })

  test('should return 400 when trying to sign up user with missing email', async () => {
    const userSignupRequestWithMissingEmail: HttpRequest = {
      body: {
        password: validUser.password
      }
    }
    const response: HttpResponse = await controller.handle(userSignupRequestWithMissingEmail)
    expect(response.statusCode).toEqual(400)
    expect(response.body).toBeInstanceOf(MissingParamError)
    expect((response.body as Error).message).toEqual('Missing parameter: email.')
  })

  test('should return 400 when trying to sign up user with missing password', async () => {
    const userSignupRequestWithMissingPassword: HttpRequest = {
      body: {
        email: validUser.email
      }
    }
    const response: HttpResponse = await controller.handle(userSignupRequestWithMissingPassword)
    expect(response.statusCode).toEqual(400)
    expect(response.body).toBeInstanceOf(MissingParamError)
    expect((response.body as Error).message).toEqual('Missing parameter: password.')
  })

  test('should return 400 when trying to sign up user with missing email and password', async () => {
    const userSignupRequestWithMissingPassword: HttpRequest = {
      body: {
      }
    }
    const response: HttpResponse = await controller.handle(userSignupRequestWithMissingPassword)
    expect(response.statusCode).toEqual(400)
    expect(response.body).toBeInstanceOf(MissingParamError)
    expect((response.body as Error).message).toEqual('Missing parameter: email password.')
  })

  test('should return 500 if an error is raised internally', async () => {
    const controllerWithStubUseCase = new SignUpController(errorThrowingSignUpUseCaseStub)
    const response: HttpResponse = await controllerWithStubUseCase.handle(validUserSignUpRequest)
    expect(response.statusCode).toEqual(500)
    expect(response.body).toBeInstanceOf(Error)
  })
})
