import { Note } from '../../entities/note'
import { User } from '../../entities/user'
import { UserRepository } from '../ports/user-repository'
import { NoteData } from './note-data'
import { NoteRepository } from './ports/note-repository'

export class CreateNote {
  private readonly noteRepository: NoteRepository
  private readonly userRepository: UserRepository

  constructor (noteRepository: NoteRepository, userRepository: UserRepository) {
    this.noteRepository = noteRepository
    this.userRepository = userRepository
  }

  public async perform (request: NoteData): Promise<NoteData> {
    const owner = await this.userRepository.findUserByEmail(request.ownerEmail)
    const note = Note.create(User.create(owner).value as User, request.title, request.content).value as Note
    return await this.noteRepository.addNote({ title: note.title.value, content: note.content, ownerId: owner.id })
  }
}
