import { UserData } from '../../../src/entities/user-data'
import { CreateNote } from '../../../src/use-cases/create-note/create-note'
import { NoteData } from '../../../src/use-cases/ports/note-data'
import { NoteRepository } from '../../../src/use-cases/ports/note-repository'
import { UserRepository } from '../../../src/use-cases/ports/user-repository'
import { InMemoryUserRepository } from '../repositories/in-memory-user-repository'
import { InMemoryNoteRepository } from '../repositories/in-memory-note-repository'
import { UserBuilder } from '../builders/user-builder'
import { NoteBuilder } from '../builders/note-builder'

describe('Create note use case', () => {
  const emptyNoteRepository: NoteRepository = new InMemoryNoteRepository([])
  const validRegisteredUser: UserData =
    UserBuilder
      .aUser()
      .build()
  const userDataArrayWithSingleUser: UserData[] = new Array(validRegisteredUser)
  const singleUserUserRepository: UserRepository = new InMemoryUserRepository(userDataArrayWithSingleUser)

  test('should create note with valid owner and title', async () => {
    const usecase = new CreateNote(emptyNoteRepository, singleUserUserRepository)
    const validCreateNoteRequest: NoteData =
      NoteBuilder
        .aNote()
        .build()
    const response: NoteData = (await usecase.perform(validCreateNoteRequest)).value as NoteData
    const addedNotes: NoteData[] = await emptyNoteRepository.findAllNotesFrom(validRegisteredUser.id)
    expect(addedNotes.length).toEqual(1)
    expect((addedNotes[0]).title).toEqual(validCreateNoteRequest.title)
    expect(response.id).not.toBeUndefined()
  })

  test('should not create note with unregistered owner', async () => {
    const usecase = new CreateNote(emptyNoteRepository, singleUserUserRepository)
    const unregisteredEmail = 'other@mail.com'
    const createNoteRequestWithUnregisteredOwner: NoteData =
      NoteBuilder
        .aNote()
        .build()
    createNoteRequestWithUnregisteredOwner.ownerEmail = unregisteredEmail
    const response: Error = (await usecase.perform(createNoteRequestWithUnregisteredOwner)).value as Error
    expect(response.name).toEqual('UnregisteredOwnerError')
  })

  test('should not create note with invalid title', async () => {
    const usecase = new CreateNote(emptyNoteRepository, singleUserUserRepository)
    const createNoteRequestWithInvalidTitle: NoteData =
      NoteBuilder
        .aNote()
        .withInvalidTitle()
        .build()
    const response: Error = (await usecase.perform(createNoteRequestWithInvalidTitle)).value as Error
    expect(response.name).toEqual('InvalidTitleError')
  })

  test('should not create note with existing title', async () => {
    const usecase = new CreateNote(emptyNoteRepository, singleUserUserRepository)
    const validCreateNoteRequest: NoteData =
      NoteBuilder
        .aNote()
        .build()
    await usecase.perform(validCreateNoteRequest)
    const error: Error = (await usecase.perform(validCreateNoteRequest)).value as Error
    expect(error.name).toEqual('ExistingTitleError')
  })
})
