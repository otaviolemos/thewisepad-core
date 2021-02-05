import { InvalidEmailError, InvalidPasswordError } from '@/entities/errors'
import { UserData, UserRepository, Encoder, UseCase } from '@/use-cases/ports'
import { User } from '@/entities'
import { Either, left, right } from '@/shared'
import { ExistingUserError } from '@/use-cases/sign-up/errors'
import { AuthenticationResult, AuthenticationService } from '@/use-cases/authentication/ports'

export class SignUp implements UseCase {
  private readonly _userRepository: UserRepository
  private readonly _encoder: Encoder
  private readonly _authentication: AuthenticationService

  private get userRepository () {
    return this._userRepository
  }

  private get encoder () {
    return this._encoder
  }

  constructor (userRepository: UserRepository, encoder: Encoder, authentication: AuthenticationService) {
    this._userRepository = userRepository
    this._encoder = encoder
    this._authentication = authentication
  }

  public async perform (userSignupRequest: UserData): Promise<Either<ExistingUserError | InvalidEmailError | InvalidPasswordError, AuthenticationResult>> {
    const userOrError = User.create(userSignupRequest.email, userSignupRequest.password)
    if (userOrError.isLeft()) {
      return left(userOrError.value)
    }

    if (await this.userRepository.findByEmail(userSignupRequest.email)) {
      return left(new ExistingUserError(userSignupRequest))
    }

    const encodedPassword = await this.encoder.encode(userSignupRequest.password)
    await this._userRepository.add({ email: userSignupRequest.email, password: encodedPassword })
    const response = (await this._authentication.auth({ email: userSignupRequest.email, password: encodedPassword })).value as AuthenticationResult

    return right(response)
  }
}
