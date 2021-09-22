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

  public static create (password: string):
    Either<InvalidPasswordError, Password> {
    if (invalid(password)) {
      return left(new InvalidPasswordError())
    }

    return right(new Password(password))
  }
}

function invalid (password: string): boolean {
  if (!password) {
    return true
  }

  if (noNumberIn(password) || tooShort(password)) {
    return true
  }

  return false
}

function noNumberIn (password: string) {
  return !(/\d/.test(password))
}

function tooShort (password: string) {
  return password.length < 6
}
