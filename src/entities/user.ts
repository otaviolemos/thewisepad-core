import { UserData } from './user-data'
import { Either, left, right } from '../shared/either'
import { InvalidEmailError } from './errors/invalid-email-error'
import { Email } from './email'

export class User {
  public readonly email: Email

  private constructor (email: Email) {
    this.email = email
  }

  public static create (userData: UserData): Either<InvalidEmailError, User> {
    const emailOrError = Email.create(userData.email)
    if (emailOrError.isLeft()) {
      return left(new InvalidEmailError())
    }

    const email: Email = emailOrError.value as Email

    return right(new User(email))
  }
}
