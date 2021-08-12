import { Either, left, right } from '@/shared'
import { InvalidEmailError, InvalidPasswordError } from '@/entities/errors'
import { Email, Password } from '@/entities'

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

  public static create (email: string, password: string):
    Either<InvalidEmailError | InvalidPasswordError, User> {
    const emailOrError = Email.create(email)
    if (emailOrError.isLeft()) {
      return left(new InvalidEmailError(email))
    }

    const passwordOrError = Password.create(password)
    if (passwordOrError.isLeft()) {
      return left(new InvalidPasswordError())
    }

    const emailObject: Email = emailOrError.value as Email
    const passwordObject: Password = passwordOrError.value as Password

    return right(new User(emailObject, passwordObject))
  }
}
