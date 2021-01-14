import { InvalidTitleError } from '../../entities/errors/invalid-title-error'
import { Note } from '../../entities/note'
import { User } from '../../entities/user'
import { Either, left, right } from '../../shared/either'
import { ExistingTitleError } from '../create-note/errors/existing-title-error'
import { NoteData } from '../ports/note-data'
import { NoteRepository } from '../ports/note-repository'
import { UserRepository } from '../ports/user-repository'

export class UpdateNote {
  private readonly noteRepository: NoteRepository
  private readonly userRepository: UserRepository

  constructor (noteRepository: NoteRepository, userRepository: UserRepository) {
    this.noteRepository = noteRepository
    this.userRepository = userRepository
  }

  public async perform (noteId: string, changedNoteData: NoteData): Promise<Either<ExistingTitleError | InvalidTitleError, NoteData>> {
    const userData = await this.userRepository.findByEmail(changedNoteData.ownerEmail)
    const owner = User.create(userData.email, userData.password).value as User
    const noteOrError = Note.create(owner, changedNoteData.title, changedNoteData.content)
    if (noteOrError.isLeft()) {
      return left(noteOrError.value)
    }

    const changedNote = noteOrError.value as Note
    const notesFromUser = await this.noteRepository.findAllNotesFrom(changedNoteData.ownerId)
    const found = notesFromUser.find(note => note.title === changedNote.title.value)
    if (found) {
      return left(new ExistingTitleError())
    }

    if (changedNoteData.title) {
      await this.noteRepository.updateTitle(noteId, changedNoteData.title)
    }
    if (changedNoteData.content) {
      await this.noteRepository.updateContent(noteId, changedNoteData.content)
    }

    return right(changedNoteData)
  }
}
