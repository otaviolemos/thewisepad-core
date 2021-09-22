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
  const maxEmailSize = 320
  if (emptyOrTooLarge(email, maxEmailSize) || nonConformant(email)) {
    return true
  }

  const [local, domain] = email.split('@')
  const maxLocalSize = 64
  const maxDomainSize = 255
  if (emptyOrTooLarge(local, maxLocalSize) || emptyOrTooLarge(domain, maxDomainSize)) {
    return true
  }

  if (somePartIsTooLargeIn(domain)) {
    return true
  }

  return false
}

function emptyOrTooLarge (str: string, maxSize: number): boolean {
  if (!str || str.length > maxSize) {
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
