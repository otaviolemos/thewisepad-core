import { InvalidPasswordError } from '@/entities/errors'
import { Either, left, right } from '@/shared'

export class Password {
  private readonly _value: string

  public get value () {
    return this._value
  }

  constructor (password: string) {
    this._value = password
    Object.freeze(this)
  }

  public static create (password: string): Either<InvalidPasswordError, Password> {
    if (!Password.validate(password)) {
      return left(new InvalidPasswordError())
    }

    return right(new Password(password))
  }

  public static validate (password: string): boolean {
    if (!password) {
      return false
    }

    if (Password.doesNotHaveNumber(password) || password.length < 6) {
      return false
    }

    return true
  }

  private static doesNotHaveNumber (str: string) {
    return !(/\d/.test(str))
  }
}
