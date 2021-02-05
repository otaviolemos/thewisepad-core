export class WrongPasswordError extends Error {
  public readonly name = 'WrongPasswordError'
  constructor () {
    super('Wrong password.')
  }
}
