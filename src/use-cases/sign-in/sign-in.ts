import { UserData, UserRepository, UseCase } from '@/use-cases/ports'
import { Either } from '@/shared'
import { UserNotFoundError, WrongPasswordError } from '@/use-cases/authentication/errors'
import { AuthenticationResult, AuthenticationService } from '../authentication/ports'

export class SignIn implements UseCase {
  private readonly userRepository: UserRepository
  private readonly authentication: AuthenticationService

  constructor (userRepository: UserRepository, authentication: AuthenticationService) {
    this.userRepository = userRepository
    this.authentication = authentication
  }

  public async perform (signinRequest: UserData): Promise<Either<UserNotFoundError | WrongPasswordError, AuthenticationResult>> {
    return await this.authentication.auth({ email: signinRequest.email, password: signinRequest.password })
  }
}
