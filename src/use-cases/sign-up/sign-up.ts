import { InvalidEmailError } from '../../entities/errors/invalid-email-error'
import { UserData } from '../../entities/ports/user-data'
import { User } from '../../entities/user'
import { Either, left, right } from '../../shared/either'
import { UserRepository } from '../ports/user-repository'
import { ExistingUserError } from './errors/existing-user-error'
import { Encoder } from '../ports/encoder'
import { InvalidPasswordError } from '../../entities/errors/invalid-password-error'

export class SignUp {
  private readonly _userRepository: UserRepository
  private readonly _encoder: Encoder

  private get userRepository () {
    return this._userRepository
  }

  private get encoder () {
    return this._encoder
  }

  constructor (userRepository: UserRepository, encoder: Encoder) {
    this._userRepository = userRepository
    this._encoder = encoder
  }

  public async perform (userSignupRequest: UserData): Promise<Either<ExistingUserError | InvalidEmailError | InvalidPasswordError, UserData>> {
    const userOrError = User.create(userSignupRequest.email, userSignupRequest.password)
    if (userOrError.isLeft()) {
      return left(userOrError.value)
    }

    if (await this.userRepository.findByEmail(userSignupRequest.email)) {
      return left(new ExistingUserError(userSignupRequest))
    }

    const encodedPassword = await this.encoder.encode(userSignupRequest.password)
    return right(await this._userRepository.add({ email: userSignupRequest.email, password: encodedPassword }))
  }
}
