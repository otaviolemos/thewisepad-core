export class ExistingTitleError extends Error {
  public readonly name = 'ExistingTitleError'
  constructor () {
    super('User already has note with the same title.')
  }
}
