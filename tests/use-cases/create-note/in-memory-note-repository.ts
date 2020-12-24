import { NoteData } from '../../../src/use-cases/create-note/note-data'
import { NoteRepository } from '../../../src/use-cases/create-note/ports/note-repository'

export class InMemoryNoteRepository implements NoteRepository {
  private readonly _data: NoteData[]
  private get data () {
    return this._data
  }

  constructor (data: NoteData[]) {
    this._data = data
  }

  public async addNote (note: NoteData): Promise<NoteData> {
    note.id = this._data.length.toString()
    this._data.push(note)
    return note
  }

  public async findAllNotesFrom (userId: string): Promise<NoteData[]> {
    return this.data.filter(note => note.ownerId === userId)
  }
}
