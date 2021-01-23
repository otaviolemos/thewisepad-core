export class MissingParamError extends Error {
  public readonly name = 'MissingParamError'

  constructor (param: string) {
    super(`Missing parameter: ${param}.`)
  }
}
