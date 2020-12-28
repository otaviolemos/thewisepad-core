import { NoteData } from '../../../src/use-cases/create-note/note-data'
import { NoteRepository } from '../../../src/use-cases/create-note/ports/note-repository'
import { v4 as uuidv4 } from 'uuid'

export class InMemoryNoteRepository implements NoteRepository {
  private readonly _data: NoteData[]
  private get data () {
    return this._data
  }

  constructor (data: NoteData[]) {
    this._data = data
  }

  public async addNote (note: NoteData): Promise<NoteData> {
    note.id = uuidv4()
    this._data.push(note)
    return note
  }

  public async findAllNotesFrom (userId: string): Promise<NoteData[]> {
    return this.data.filter(note => note.ownerId === userId)
  }

  public async findNote (noteId: string): Promise<NoteData> {
    const note = this.data.find(note => note.id === noteId)
    return note || null
  }

  public async remove (noteId: string): Promise<NoteData> {
    const noteToBeRemoved = this.data.find(note => note.id === noteId)
    if (!noteToBeRemoved) {
      return null
    }
    this.data.splice(this.data.findIndex(note => note.id === noteId), 1)
    return noteToBeRemoved
  }
}
