import { HttpRequest, HttpResponse } from '@/presentation/controllers/ports'
import { SignUpOperation } from '@/presentation/controllers/sign-up'
import { InvalidEmailError, InvalidPasswordError } from '@/entities/errors'
import { Encoder, UseCase } from '@/use-cases/ports'
import { SignUp } from '@/use-cases/sign-up'
import { ExistingUserError } from '@/use-cases/sign-up/errors'
import { UserBuilder } from '@test/builders'
import { InMemoryUserRepository } from '@test/doubles/repositories'
import { FakeEncoder } from '@test/doubles/encoder'
import { MissingParamError } from '@/presentation/controllers/errors'
import { makeAuthenticationStub } from '@test/use-cases/authentication'
import { AuthenticationResult } from '@/use-cases/authentication/ports'
import { ErrorThrowingUseCaseStub } from '@test/doubles/usecases'
import { WebController } from '@/presentation/controllers'

describe('Sign up controller', () => {
  const emptyUserRepository = new InMemoryUserRepository([])
  const encoder: Encoder = new FakeEncoder()
  const authenticationStub = makeAuthenticationStub()
  const signUpUseCase: UseCase = new SignUp(emptyUserRepository, encoder, authenticationStub)
  const controller = new WebController(new SignUpOperation(signUpUseCase))
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
  const errorThrowingSignUpUseCaseStub: ErrorThrowingUseCaseStub = new ErrorThrowingUseCaseStub()

  test('should return 201 and authentication result when user is successfully signed up', async () => {
    const response: HttpResponse = await controller.handle(validUserSignUpRequest)
    const authResult = response.body as AuthenticationResult
    expect(response.statusCode).toEqual(201)
    expect(authResult.id).toEqual(validUser.id)
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
    expect((response.body as Error).message).toEqual('Missing parameter: email, password.')
  })

  test('should return 500 if an error is raised internally', async () => {
    const controllerWithStubUseCase = new WebController(new SignUpOperation(errorThrowingSignUpUseCaseStub))
    const response: HttpResponse = await controllerWithStubUseCase.handle(validUserSignUpRequest)
    expect(response.statusCode).toEqual(500)
    expect(response.body).toBeInstanceOf(Error)
  })
})
