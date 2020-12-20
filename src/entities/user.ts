import { UserData } from './user-data'
import { Either, left, right } from '../shared/either'
import { InvalidEmailError } from './errors/invalid-email-error'
import { Email } from './email'
import { Password } from './password'
import { InvalidPasswordError } from './errors/invalid-password-error'

export class User {
  private readonly _email: Email
  private readonly _password: Password

  public get email () {
    return this._email
  }

  public get password () {
    return this._password
  }

  private constructor (email: Email, password: Password) {
    this._email = email
    this._password = password
    Object.freeze(this)
  }

  public static create (userData: UserData): Either<InvalidEmailError | InvalidPasswordError, User> {
    const emailOrError = Email.create(userData.email)
    if (emailOrError.isLeft()) {
      return left(new InvalidEmailError(userData.email))
    }

    const passwordOrError = Password.create(userData.password)
    if (passwordOrError.isLeft()) {
      return left(new InvalidPasswordError())
    }

    const email: Email = emailOrError.value as Email
    const password: Password = passwordOrError.value as Password

    return right(new User(email, password))
  }
}
