import { NoteData, NoteRepository, UseCase } from '@/use-cases/ports'

export class RemoveNote implements UseCase {
  private readonly noteRepository: NoteRepository

  constructor (noteRepository: NoteRepository) {
    this.noteRepository = noteRepository
  }

  async perform (noteId: string): Promise<NoteData> {
    return await this.noteRepository.remove(noteId)
  }
}
