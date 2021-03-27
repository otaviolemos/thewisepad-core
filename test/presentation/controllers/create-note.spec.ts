import { CreateNoteOperation } from '@/presentation/controllers/create-note'
import { HttpRequest, HttpResponse } from '@/presentation/controllers/ports'
import { CreateNote } from '@/use-cases/create-note'
import { UnregisteredOwnerError } from '@/use-cases/create-note/errors'
import { NoteBuilder, UserBuilder } from '@test/builders'
import { InMemoryNoteRepository, InMemoryUserRepository } from '@test/doubles/repositories'
import { ErrorThrowingUseCaseStub } from '@test/doubles/usecases'
import { WebController } from '@/presentation/controllers'

describe('Create note controller', () => {
  test('should return 201 when note is successfully created', async () => {
    const aNote = NoteBuilder.aNote().build()
    const aUser = UserBuilder.aUser().build()
    const emptyNoteRepository = new InMemoryNoteRepository([])
    const createNoteUseCase = new CreateNote(emptyNoteRepository, new InMemoryUserRepository([aUser]))
    const createNoteController = new WebController(new CreateNoteOperation(createNoteUseCase))
    const validRequest: HttpRequest = {
      body: {
        title: aNote.title,
        content: aNote.content,
        ownerEmail: aNote.ownerEmail
      }
    }
    const response: HttpResponse = await createNoteController.handle(validRequest)
    expect(response.statusCode).toBe(201)
    expect((await emptyNoteRepository.findAllNotesFrom(aUser.id)).length).toBe(1)
  })

  test('should return 400 when title is missing from the request', async () => {
    const aNote = NoteBuilder.aNote().build()
    const aUser = UserBuilder.aUser().build()
    const emptyNoteRepository = new InMemoryNoteRepository([])
    const createNoteUseCase = new CreateNote(emptyNoteRepository, new InMemoryUserRepository([aUser]))
    const createNoteController = new WebController(new CreateNoteOperation(createNoteUseCase))
    const requestWithoutTitle: HttpRequest = {
      body: {
        content: aNote.content,
        ownerEmail: aNote.ownerEmail
      }
    }
    const response: HttpResponse = await createNoteController.handle(requestWithoutTitle)
    expect(response.statusCode).toBe(400)
  })

  test('should return 400 when required fields are missing from the request', async () => {
    const aUser = UserBuilder.aUser().build()
    const emptyNoteRepository = new InMemoryNoteRepository([])
    const createNoteUseCase = new CreateNote(emptyNoteRepository, new InMemoryUserRepository([aUser]))
    const createNoteController = new WebController(new CreateNoteOperation(createNoteUseCase))
    const requestWithoutTitle: HttpRequest = {
      body: {
      }
    }
    const response: HttpResponse = await createNoteController.handle(requestWithoutTitle)
    expect(response.statusCode).toBe(400)
    expect((response.body as Error).message).toEqual('Missing parameter: title, content, ownerEmail.')
  })

  test('should return 400 when owner is not registered', async () => {
    const aNote = NoteBuilder.aNote().build()
    const aUser = UserBuilder.aUser().build()
    const emptyNoteRepository = new InMemoryNoteRepository([])
    const createNoteUseCase = new CreateNote(emptyNoteRepository, new InMemoryUserRepository([aUser]))
    const createNoteController = new WebController(new CreateNoteOperation(createNoteUseCase))
    const requestWithUnregisteredUser: HttpRequest = {
      body: {
        title: aNote.title,
        content: aNote.content,
        ownerEmail: 'unregistered@mail.com'
      }
    }
    const response: HttpResponse = await createNoteController.handle(requestWithUnregisteredUser)
    expect(response.statusCode).toBe(400)
    expect(response.body).toBeInstanceOf(UnregisteredOwnerError)
  })

  test('should return 500 when server raises', async () => {
    const aNote = NoteBuilder.aNote().build()
    const errorThrowingCreateNoteUseCaseStub = new ErrorThrowingUseCaseStub()
    const createNoteController = new WebController(new CreateNoteOperation(errorThrowingCreateNoteUseCaseStub))
    const validRequest: HttpRequest = {
      body: {
        title: aNote.title,
        content: aNote.content,
        ownerEmail: aNote.ownerEmail
      }
    }
    const response: HttpResponse = await createNoteController.handle(validRequest)
    expect(response.statusCode).toBe(500)
  })
})
