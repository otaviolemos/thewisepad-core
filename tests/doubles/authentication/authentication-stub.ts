import { Either, right } from '@/shared'
import { UserNotFoundError, WrongPasswordError } from '@/use-cases/authentication/errors'
import { AuthenticationParams, AuthenticationResult, AuthenticationService } from '@/use-cases/authentication/ports'
import { UserBuilder } from '@test/builders'

class AuthenticationServiceStub implements AuthenticationService {
  async auth (authenticationParams: AuthenticationParams): Promise<Either<UserNotFoundError | WrongPasswordError, AuthenticationResult>> {
    return right({
      accessToken: 'accessToken',
      id: UserBuilder.aUser().build().id
    })
  }
}

export function makeAuthenticationStub () {
  return new AuthenticationServiceStub()
}
