import { Either, left, right } from '@/shared'
import { InvalidTitleError } from '@/entities/errors'

export class Title {
  public readonly value: string

  private constructor (title: string) {
    this.value = title
    Object.freeze(this)
  }

  public static create (title: string): Either<InvalidTitleError, Title> {
    if (invalid(title)) {
      return left(new InvalidTitleError(title))
    }

    return right(new Title(title))
  }
}

function invalid (title: string): boolean {
  if (emptyOrTooLittle(title) || tooLarge(title)) {
    return true
  }

  return false
}

function emptyOrTooLittle (title: string): boolean {
  return !title || title.trim().length < 3
}

function tooLarge (title: string): boolean {
  return title.length > 256
}
