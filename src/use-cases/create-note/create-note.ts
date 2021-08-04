import { InvalidTitleError } from '@/entities/errors'
import { Note, User } from '@/entities'
import { Either, left, right } from '@/shared'
import { NoteData, UserRepository, NoteRepository, UseCase } from '@/use-cases/ports'
import { ExistingTitleError, UnregisteredOwnerError } from '@/use-cases/create-note/errors'

export class CreateNote implements UseCase {
  private readonly noteRepository: NoteRepository
  private readonly userRepository: UserRepository

  constructor (noteRepository: NoteRepository, userRepository: UserRepository) {
    this.noteRepository = noteRepository
    this.userRepository = userRepository
  }

  public async perform (request: NoteData):
    Promise<Either<ExistingTitleError | UnregisteredOwnerError | InvalidTitleError, NoteData>> {
    const owner = await this.userRepository.findByEmail(request.ownerEmail)
    if (!owner) {
      return left(new UnregisteredOwnerError())
    }

    const ownerUser = User.create(owner.email, owner.password).value as User
    const noteOrError = Note.create(ownerUser, request.title, request.content)
    if (noteOrError.isLeft()) {
      return left(noteOrError.value)
    }

    const ownerNotes: NoteData[] = await this.noteRepository.findAllNotesFrom(owner.id)
    const noteExists = ownerNotes.find(note => note.title === request.title)
    if (noteExists) {
      return left(new ExistingTitleError())
    }

    const note: Note = noteOrError.value
    return right(await this.noteRepository.add({
      title: note.title.value,
      content: note.content,
      ownerEmail: ownerUser.email.value,
      ownerId: owner.id
    }))
  }
}
