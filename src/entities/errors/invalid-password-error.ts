export class InvalidPasswordError extends Error {
  public readonly name = 'InvalidPasswordError'
  constructor () {
    super('Invalid password.')
  }
}
