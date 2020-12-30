import { NoteData } from '../create-note/note-data'
import { NoteRepository } from '../ports/note-repository'

export class LoadNotesForUser {
  private readonly noteRepository: NoteRepository

  constructor (noteRepository: NoteRepository) {
    this.noteRepository = noteRepository
  }

  public async perform (requestUserId: string): Promise<NoteData[]> {
    return await this.noteRepository.findAllNotesFrom(requestUserId)
  }
}
