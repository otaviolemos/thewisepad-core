import { Either, left, right } from '@/shared'
import { NoteRepository, UseCase } from '@/use-cases/ports'
import { UnexistingNoteError } from '@/use-cases/remove-note/errors'

export class RemoveNote implements UseCase {
  private readonly noteRepository: NoteRepository

  constructor (noteRepository: NoteRepository) {
    this.noteRepository = noteRepository
  }

  async perform (noteId: string): Promise<Either<UnexistingNoteError, void>> {
    if (await this.noteRepository.findById(noteId)) {
      return right(await this.noteRepository.remove(noteId))
    }
    return left(new UnexistingNoteError())
  }
}
