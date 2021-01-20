import { HttpRequest, HttpResponse } from '@/web-controllers/ports'
import { SignUpController } from '@/web-controllers/sign-up'
import { InvalidEmailError, InvalidPasswordError } from '@/entities/errors'
import { Encoder, UserData } from '@/use-cases/ports'
import { SignUp } from '@/use-cases/sign-up'
import { ExistingUserError } from '@/use-cases/sign-up/errors'
import { UserBuilder } from '@test/use-cases/builders'
import { InMemoryUserRepository } from '@test/use-cases/repositories'
import { FakeEncoder } from '@test/use-cases/sign-up'
import { UseCase } from '@/use-cases/ports/use-case'

describe('Sign up controller', () => {
  const emptyUserRepository = new InMemoryUserRepository([])
  const encoder: Encoder = new FakeEncoder()
  const signUpUseCase: UseCase = new SignUp(emptyUserRepository, encoder)
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
  class ErrorThrowingSingUpUseCaseStub implements UseCase {
    async perform (request: UserData): Promise<void> {
      throw Error()
    }
  }
  const errorThrowingSignUpUseCaseStub: ErrorThrowingSingUpUseCaseStub = new ErrorThrowingSingUpUseCaseStub()

  test('should return 201 and registered user when user is successfully signed up', async () => {
    const response: HttpResponse = await controller.handle(validUserSignUpRequest)
    expect(response.statusCode).toEqual(201)
    expect((response.body as UserData).id).toEqual('0')
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

  test('should return 500 if an error is raised internally', async () => {
    const controllerWithMockUseCase = new SignUpController(errorThrowingSignUpUseCaseStub)
    const response: HttpResponse = await controllerWithMockUseCase.handle(validUserSignUpRequest)
    expect(response.statusCode).toEqual(500)
    expect(response.body).toBeInstanceOf(Error)
  })
})
