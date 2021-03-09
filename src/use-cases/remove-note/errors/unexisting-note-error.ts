export class UnexistingNoteError extends Error {
  public readonly name = 'UnexistingNoteError'
  constructor () {
    super('Note does not exist.')
  }
}
