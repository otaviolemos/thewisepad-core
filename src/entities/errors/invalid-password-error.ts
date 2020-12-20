export class InvalidPasswordError extends Error {
  constructor () {
    super('Invalid password.')
  }
}
