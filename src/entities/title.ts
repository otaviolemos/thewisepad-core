import { Either, left, right } from '@/shared'
import { InvalidTitleError } from '@/entities/errors'

export class Title {
  public readonly value: string

  private constructor (title: string) {
    this.value = title
    Object.freeze(this)
  }

  public static create (title: string): Either<InvalidTitleError, Title> {
    if (valid(title)) {
      return right(new Title(title))
    }

    return left(new InvalidTitleError(title))
  }
}

function valid (title: string): boolean {
  if (emptyOrTooLittle(title) || tooLarge(title)) {
    return false
  }

  return true
}

function emptyOrTooLittle (title: string): boolean {
  return !title || title.trim().length < 3
}

function tooLarge (title: string): boolean {
  return title.length > 256
}
