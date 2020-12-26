import { NoteData } from '../create-note/note-data'
import { NoteRepository } from '../create-note/ports/note-repository'

export class RemoveNote {
  private readonly noteRepository: NoteRepository

  constructor (noteRepository: NoteRepository) {
    this.noteRepository = noteRepository
  }

  async perform (noteId: string): Promise<NoteData> {
    return await this.noteRepository.remove(noteId)
  }
}
