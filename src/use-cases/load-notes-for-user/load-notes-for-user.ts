import { NoteData, NoteRepository } from '@/use-cases/ports'

export class LoadNotesForUser {
  private readonly noteRepository: NoteRepository

  constructor (noteRepository: NoteRepository) {
    this.noteRepository = noteRepository
  }

  public async perform (requestUserId: string): Promise<NoteData[]> {
    return await this.noteRepository.findAllNotesFrom(requestUserId)
  }
}
