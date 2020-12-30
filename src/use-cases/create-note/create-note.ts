import { InvalidTitleError } from '../../entities/errors/invalid-title-error'
import { Note } from '../../entities/note'
import { User } from '../../entities/user'
import { Either, left, right } from '../../shared/either'
import { UserRepository } from '../ports/user-repository'
import { ExistingTitleError } from './errors/existing-title-error'
import { UnregisteredOwnerError } from './errors/invalid-owner-error'
import { NoteData } from './note-data'
import { NoteRepository } from '../ports/note-repository'

export class CreateNote {
  private readonly noteRepository: NoteRepository
  private readonly userRepository: UserRepository

  constructor (noteRepository: NoteRepository, userRepository: UserRepository) {
    this.noteRepository = noteRepository
    this.userRepository = userRepository
  }

  public async perform (request: NoteData): Promise<Either<ExistingTitleError | UnregisteredOwnerError | InvalidTitleError, NoteData>> {
    const owner = await this.userRepository.findUserByEmail(request.ownerEmail)
    if (!owner) {
      return left(new UnregisteredOwnerError())
    }

    const noteOrError = Note.create(User.create(owner).value as User, request.title, request.content)
    if (noteOrError.isLeft()) {
      return left(noteOrError.value)
    }

    const ownerNotes: NoteData[] = await this.noteRepository.findAllNotesFrom(owner.id)
    const existing = ownerNotes.find(note => note.title === request.title)
    if (existing) {
      return left(new ExistingTitleError())
    }

    const note: Note = noteOrError.value
    return right(await this.noteRepository.addNote({ title: note.title.value, content: note.content, ownerId: owner.id }))
  }
}
