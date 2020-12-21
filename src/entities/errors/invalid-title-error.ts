export class InvalidTitleError extends Error {
  public readonly name = 'InvalidTitleError'
  constructor (title: string) {
    super('Invalid title: ' + title + '.')
  }
}
