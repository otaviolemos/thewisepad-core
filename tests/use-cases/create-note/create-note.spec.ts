import { UserData } from '../../../src/entities/user-data'
import { CreateNote } from '../../../src/use-cases/create-note/create-note'
import { NoteData } from '../../../src/use-cases/create-note/note-data'
import { NoteRepository } from '../../../src/use-cases/create-note/ports/note-repository'
import { UserRepository } from '../../../src/use-cases/ports/user-repository'
import { InMemoryUserRepository } from '../in-memory-user-repository'
import { InMemoryNoteRepository } from './in-memory-note-repository'

describe('Create note use case', () => {
  const validEmail = 'any@mail.com'
  const unregisteredEmail = 'other@mail.com'
  const validPassword = '1validpassword'
  const validTitle = 'my note'
  const invalidTitle = ''
  const emptyContent = ''
  const emptyNoteRepository: NoteRepository = new InMemoryNoteRepository([])
  const validRegisteredUser: UserData = { email: validEmail, password: validPassword, id: '0' }
  const unregisteredUser: UserData = { email: unregisteredEmail, password: validPassword }
  const userDataArrayWithSingleUser: UserData[] = new Array(validRegisteredUser)
  const singleUserUserRepository: UserRepository = new InMemoryUserRepository(userDataArrayWithSingleUser)

  const validCreateNoteRequest: NoteData = {
    title: validTitle,
    content: emptyContent,
    ownerEmail: validRegisteredUser.email
  }

  const createNoteRequestWithInvalidTitle: NoteData = {
    title: invalidTitle,
    content: emptyContent,
    ownerEmail: validRegisteredUser.email
  }

  const createNoteRequestWithUnregisteredOwner: NoteData = {
    title: validTitle,
    content: emptyContent,
    ownerEmail: unregisteredUser.email
  }

  test('should create note with valid owner and title', async () => {
    const usecase = new CreateNote(emptyNoteRepository, singleUserUserRepository)
    const response: NoteData = (await usecase.perform(validCreateNoteRequest)).value as NoteData
    const addedNotes: NoteData[] = await emptyNoteRepository.findAllNotesFrom(validRegisteredUser.id)
    expect(addedNotes.length).toEqual(1)
    expect((addedNotes[0]).title).toEqual(validTitle)
    expect(response.id).not.toBeUndefined()
  })

  test('should not create note with unregistered owner', async () => {
    const usecase = new CreateNote(emptyNoteRepository, singleUserUserRepository)
    const response: Error = (await usecase.perform(createNoteRequestWithUnregisteredOwner)).value as Error
    expect(response.name).toEqual('UnregisteredOwnerError')
  })

  test('should not create note with invalid title', async () => {
    const usecase = new CreateNote(emptyNoteRepository, singleUserUserRepository)
    const response: Error = (await usecase.perform(createNoteRequestWithInvalidTitle)).value as Error
    expect(response.name).toEqual('InvalidTitleError')
  })

  test('should not create note with existing title', async () => {
    const usecase = new CreateNote(emptyNoteRepository, singleUserUserRepository)
    await usecase.perform(validCreateNoteRequest)
    const error: Error = (await usecase.perform(validCreateNoteRequest)).value as Error
    expect(error.name).toEqual('ExistingTitleError')
  })
})
