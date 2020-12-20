export class InvalidTitleError extends Error {
  constructor (title: string) {
    super('Invalid title: ' + title + '.')
  }
}
