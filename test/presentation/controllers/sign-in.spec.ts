import { CustomAuthentication } from '@/use-cases/authentication'
import { AuthenticationResult } from '@/use-cases/authentication/ports'
import { UserData, UserRepository } from '@/use-cases/ports'
import { SignIn } from '@/use-cases/sign-in'
import { SignInOperation, WebController } from '@/presentation/controllers'
import { HttpRequest, HttpResponse } from '@/presentation/controllers/ports'
import { UserBuilder } from '@test/builders'
import { FakeTokenManager } from '@test/doubles/authentication'
import { FakeEncoder } from '@test/doubles/encoder'
import { InMemoryUserRepository } from '@test/doubles/repositories'
import { MissingParamError } from '@/presentation/controllers/errors'
import { UserNotFoundError, WrongPasswordError } from '@/use-cases/authentication/errors'
import { ErrorThrowingUseCaseStub } from '@test/doubles/usecases/error-throwing-use-case-stub'

describe('Sign in controller', () => {
  test('should return 200 if valid credentials are provided', async () => {
    const singleUserUserRepository = await getSingleUserUserRepository()
    const validUser: UserData = UserBuilder.aUser().build()
    const usecase = new SignIn(new CustomAuthentication(singleUserUserRepository, new FakeEncoder(), new FakeTokenManager()))
    const validUserSignInRequest: HttpRequest = {
      body: {
        email: validUser.email,
        password: validUser.password
      }
    }
    const controller = new WebController(new SignInOperation(usecase))
    const response: HttpResponse = await controller.handle(validUserSignInRequest)
    const authResult = response.body as AuthenticationResult
    expect(response.statusCode).toEqual(200)
    expect(authResult.id).toEqual(validUser.id)
    expect(authResult.accessToken).toBeDefined()
  })

  test('should return 400 if email is missing in the request', async () => {
    const singleUserUserRepository = await getSingleUserUserRepository()
    const validUser: UserData = UserBuilder.aUser().build()
    const usecase = new SignIn(new CustomAuthentication(singleUserUserRepository, new FakeEncoder(), new FakeTokenManager()))
    const signInRequestWithoutEmail: HttpRequest = {
      body: {
        password: validUser.password
      }
    }
    const controller = new WebController(new SignInOperation(usecase))
    const response: HttpResponse = await controller.handle(signInRequestWithoutEmail)
    expect(response.statusCode).toEqual(400)
    expect(response.body).toBeInstanceOf(MissingParamError)
    expect((response.body as Error).message).toEqual('Missing parameter: email.')
  })

  test('should return 400 if password is missing in the request', async () => {
    const singleUserUserRepository = await getSingleUserUserRepository()
    const validUser: UserData = UserBuilder.aUser().build()
    const usecase = new SignIn(new CustomAuthentication(singleUserUserRepository, new FakeEncoder(), new FakeTokenManager()))
    const signInRequestWithoutPassword: HttpRequest = {
      body: {
        email: validUser.email
      }
    }
    const controller = new WebController(new SignInOperation(usecase))
    const response: HttpResponse = await controller.handle(signInRequestWithoutPassword)
    expect(response.statusCode).toEqual(400)
    expect(response.body).toBeInstanceOf(MissingParamError)
    expect((response.body as Error).message).toEqual('Missing parameter: password.')
  })

  test('should return 400 if password and email are missing in the request', async () => {
    const singleUserUserRepository = await getSingleUserUserRepository()
    const usecase = new SignIn(new CustomAuthentication(singleUserUserRepository, new FakeEncoder(), new FakeTokenManager()))
    const signInRequestWithoutEmailAndPassword: HttpRequest = {
      body: {
      }
    }
    const controller = new WebController(new SignInOperation(usecase))
    const response: HttpResponse = await controller.handle(signInRequestWithoutEmailAndPassword)
    expect(response.statusCode).toEqual(400)
    expect(response.body).toBeInstanceOf(MissingParamError)
    expect((response.body as Error).message).toEqual('Missing parameter: email, password.')
  })

  test('should return 403 if password is incorrect', async () => {
    const singleUserUserRepository = await getSingleUserUserRepository()
    const validUser: UserData = UserBuilder.aUser().build()
    const usecase = new SignIn(new CustomAuthentication(singleUserUserRepository, new FakeEncoder(), new FakeTokenManager()))
    const signInRequestWithIncorrectPassword: HttpRequest = {
      body: {
        email: validUser.email,
        password: 'incorrect password'
      }
    }
    const controller = new WebController(new SignInOperation(usecase))
    const response: HttpResponse = await controller.handle(signInRequestWithIncorrectPassword)
    expect(response.statusCode).toEqual(403)
    expect(response.body).toBeInstanceOf(WrongPasswordError)
  })

  test('should return 400 if user is not found', async () => {
    const singleUserUserRepository = await getSingleUserUserRepository()
    const anotherUser: UserData = UserBuilder.aUser().withDifferentEmail().build()
    const usecase = new SignIn(new CustomAuthentication(singleUserUserRepository, new FakeEncoder(), new FakeTokenManager()))
    const signInRequestWithUnregisteredUser: HttpRequest = {
      body: {
        email: anotherUser.email,
        password: anotherUser.email
      }
    }
    const controller = new WebController(new SignInOperation(usecase))
    const response: HttpResponse = await controller.handle(signInRequestWithUnregisteredUser)
    expect(response.statusCode).toEqual(400)
    expect(response.body).toBeInstanceOf(UserNotFoundError)
  })

  test('should return 500 if an error is raised internally', async () => {
    const validUser: UserData = UserBuilder.aUser().build()
    const validUserSignInRequest: HttpRequest = {
      body: {
        email: validUser.email,
        password: validUser.password
      }
    }
    const errorThrowingSignInUseCaseStub: ErrorThrowingUseCaseStub = new ErrorThrowingUseCaseStub()
    const controllerWithStubUseCase = new WebController(new SignInOperation(errorThrowingSignInUseCaseStub))
    const response: HttpResponse = await controllerWithStubUseCase.handle(validUserSignInRequest)
    expect(response.statusCode).toEqual(500)
    expect(response.body).toBeInstanceOf(Error)
  })

  async function getSingleUserUserRepository (): Promise<UserRepository> {
    const aUser = UserBuilder.aUser().build()
    const userDataArrayWithSingleUser: UserData[] =
      new Array({
        email: aUser.email,
        password: await new FakeEncoder().encode(aUser.password),
        id: aUser.id
      })
    return new InMemoryUserRepository(userDataArrayWithSingleUser)
  }
})
