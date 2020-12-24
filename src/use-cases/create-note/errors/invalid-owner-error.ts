export class UnregisteredOwnerError extends Error {
  public readonly name = 'UnregisteredOwnerError'
  constructor () {
    super('Unregistered owner.')
  }
}
