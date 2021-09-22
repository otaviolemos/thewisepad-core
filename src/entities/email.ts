import { Either, left, right } from '@/shared'
import { InvalidEmailError } from '@/entities/errors'

export class Email {
  public readonly value: string

  private constructor (email: string) {
    this.value = email
    Object.freeze(this)
  }

  public static create (email: string): Either<InvalidEmailError, Email> {
    if (invalid(email)) {
      return left(new InvalidEmailError(email))
    }

    return right(new Email(email))
  }
}

export function invalid (email: string): boolean {
  if (emptyOrTooLarge(email, 320) || nonConformant(email)) {
    return true
  }

  const [local, domain] = email.split('@')
  if (emptyOrTooLarge(local, 64) || emptyOrTooLarge(domain, 255)) {
    return true
  }

  if (somePartIsTooLargeIn(domain)) {
    return true
  }

  return false
}

function emptyOrTooLarge (str: string, maxSize: number): boolean {
  if (!str || str.length === 0 || str.length > maxSize) {
    return true
  }
}

function nonConformant (email: string): boolean {
  const emailRegex =
    /^[-!#$%&'*+/0-9=?A-Z^_a-z`{|}~](\.?[-!#$%&'*+/0-9=?A-Z^_a-z`{|}~])*@[a-zA-Z0-9](-*\.?[a-zA-Z0-9])*\.[a-zA-Z](-?[a-zA-Z0-9])+$/

  return !emailRegex.test(email)
}

function somePartIsTooLargeIn (domain: string): boolean {
  const maxPartSize = 63
  const domainParts = domain.split('.')
  return domainParts.some(function (part) {
    return part.length > maxPartSize
  })
}
