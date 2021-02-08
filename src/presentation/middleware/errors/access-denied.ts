export class AccessDeniedError extends Error {
  public readonly name = 'AccessDeniedError'
  constructor () {
    super('Access denied.')
  }
}
