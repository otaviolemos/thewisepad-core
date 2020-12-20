export class InvalidEmailError extends Error {
  constructor (email: string) {
    super('Invalid email: ' + email + '.')
  }
}
