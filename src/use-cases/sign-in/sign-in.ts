import { UserData } from '../../entities/user-data'
import { Either, left, right } from '../../shared/either'
import { UserRepository } from '../ports/user-repository'
import { Encoder } from '../ports/encoder'
import { UserNotFoundError } from './errors/user-not-found-error'
import { WrongPasswordError } from './errors/wrong-password-error'

export class SignIn {
  private readonly userRepository: UserRepository
  private readonly encoder: Encoder

  constructor (userRepository: UserRepository, encoder: Encoder) {
    this.userRepository = userRepository
    this.encoder = encoder
  }

  public async perform (signinRequest: UserData): Promise<Either<UserNotFoundError | WrongPasswordError, UserData>> {
    const user = await this.userRepository.findUserByEmail(signinRequest.email)
    if (!user) {
      return left(new UserNotFoundError())
    }
    const checkPassword = await this.encoder.compare(signinRequest.password, user.password)
    if (!checkPassword) {
      return left(new WrongPasswordError())
    }

    return right(signinRequest)
  }
}
