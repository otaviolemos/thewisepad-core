import { Either, left, right } from '../shared/either'
import { InvalidTitleError } from './errors/invalid-title-error'

export class Title {
  public readonly value: string

  private constructor (title: string) {
    this.value = title
  }

  public static create (title: string): Either<InvalidTitleError, Title> {
    if (Title.validate(title)) {
      return right(new Title(title))
    }

    return left(new InvalidTitleError(title))
  }

  static validate (title: string): boolean {
    if (!title) {
      return false
    }
    if (title.trim().length < 3 || title.trim().length > 256) {
      return false
    }
    return true
  }
}
