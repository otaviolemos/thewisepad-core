import { InvalidTitleError } from '@/entities/errors'
import { Note, User } from '@/entities'
import { Either, left, right } from '@/shared'
import { ExistingTitleError } from '@/use-cases/create-note/errors'
import { UseCase, NoteData, NoteRepository, UserRepository } from '@/use-cases/ports'
import { UnexistingNoteError } from '@/use-cases/remove-note/errors'

export type UpdateNoteRequest = {
  title?: string,
  content?: string,
  ownerEmail: string,
  ownerId: string,
  id: string
}

export class UpdateNote implements UseCase {
  private readonly noteRepository: NoteRepository
  private readonly userRepository: UserRepository

  constructor (noteRepository: NoteRepository, userRepository: UserRepository) {
    this.noteRepository = noteRepository
    this.userRepository = userRepository
  }

  public async perform (changedNoteData: UpdateNoteRequest):
    Promise<Either<UnexistingNoteError | InvalidTitleError | ExistingTitleError, NoteData>> {
    const userData = await this.userRepository.findByEmail(changedNoteData.ownerEmail)
    const originalNoteData = await this.noteRepository.findById(changedNoteData.id)
    if (!originalNoteData) {
      return left(new UnexistingNoteError())
    }

    const owner = User.create(userData.email, userData.password).value as User
    let titleToBeUsed: string = originalNoteData.title
    if (shouldChangeTitle(changedNoteData)) {
      titleToBeUsed = changedNoteData.title
    }

    const noteOrError = Note.create(owner, titleToBeUsed, changedNoteData.content)
    if (noteOrError.isLeft()) {
      return left(noteOrError.value)
    }

    const changedNote = noteOrError.value as Note

    if (shouldChangeTitle(changedNoteData)) {
      if (await this.newTitleAlreadyExists(changedNoteData, changedNote)) {
        return left(new ExistingTitleError())
      }
      await this.noteRepository.updateTitle(changedNoteData.id, changedNoteData.title)
    }

    if (shouldChangeContent(changedNoteData)) {
      await this.noteRepository.updateContent(changedNoteData.id, changedNoteData.content)
    }

    return right(await this.noteRepository.findById(changedNoteData.id))
  }

  private async newTitleAlreadyExists (changedNoteData: UpdateNoteRequest, changedNote: Note) {
    const notesFromUser = await this.noteRepository.findAllNotesFrom(changedNoteData.ownerId)
    const found = notesFromUser.find(note => note.title === changedNote.title.value)
    return found
  }
}

function shouldChangeTitle (updateNoteRequest: UpdateNoteRequest) {
  return Object.keys(updateNoteRequest).indexOf('title') !== -1
}

function shouldChangeContent (updateNoteRequest: UpdateNoteRequest) {
  return Object.keys(updateNoteRequest).indexOf('content') !== -1
}
