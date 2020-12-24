import { UserData } from '../../../src/entities/user-data'
import { CreateNote } from '../../../src/use-cases/create-note/create-note'
import { NoteData } from '../../../src/use-cases/create-note/note-data'
import { NoteRepository } from '../../../src/use-cases/create-note/ports/note-repository'
import { UserRepository } from '../../../src/use-cases/ports/user-repository'
import { InMemoryUserRepository } from '../in-memory-user-repository'
import { InMemoryNoteRepository } from './in-memory-note-repository'

describe('Create note use case', () => {
  const validEmail = 'any@mail.com'
  const validPassword = '1validpassword'
  const validTitle = 'my note'
  const emptyContent = ''
  const emptyNoteRepository: NoteRepository = new InMemoryNoteRepository([])
  const validRegisteredUser: UserData = { email: validEmail, password: validPassword, id: '0' }
  const userDataArrayWithSingleUser: UserData[] = new Array(validRegisteredUser)
  const singleUserUserRepository: UserRepository = new InMemoryUserRepository(userDataArrayWithSingleUser)

  const validCreateNoteRequest: NoteData = {
    title: validTitle,
    content: emptyContent,
    ownerEmail: validRegisteredUser.email
  }
  test('should create note with valid user and title', async () => {
    const usecase = new CreateNote(emptyNoteRepository, singleUserUserRepository)
    const response: NoteData = await usecase.perform(validCreateNoteRequest) as NoteData
    const addedNotes: NoteData[] = await emptyNoteRepository.findAllNotesFrom(validRegisteredUser.id)
    expect(addedNotes.length).toEqual(1)
    expect((addedNotes[0]).title).toEqual(validTitle)
    expect(response.id).toEqual('0')
  })
})
