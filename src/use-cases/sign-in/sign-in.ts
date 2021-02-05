import { UserData, UserRepository, Encoder, UseCase } from '@/use-cases/ports'
import { Either, left, right } from '@/shared'
import { UserNotFoundError, WrongPasswordError } from '@/use-cases/authentication/errors'

export class SignIn implements UseCase {
  private readonly userRepository: UserRepository
  private readonly encoder: Encoder

  constructor (userRepository: UserRepository, encoder: Encoder) {
    this.userRepository = userRepository
    this.encoder = encoder
  }

  public async perform (signinRequest: UserData): Promise<Either<UserNotFoundError | WrongPasswordError, UserData>> {
    const user = await this.userRepository.findByEmail(signinRequest.email)
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
