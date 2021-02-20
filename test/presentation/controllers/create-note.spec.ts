import { CreateNoteController } from '@/presentation/controllers/create-note'
import { HttpRequest, HttpResponse } from '@/presentation/controllers/ports'
import { CreateNote } from '@/use-cases/create-note'
import { NoteBuilder, UserBuilder } from '@test/builders'
import { InMemoryNoteRepository, InMemoryUserRepository } from '@test/doubles/repositories'

describe('Create note controller', () => {
  test('should return 201 when note is successfully created', async () => {
    const aNote = NoteBuilder.aNote().build()
    const aUser = UserBuilder.aUser().build()
    const emptyNoteRepository = new InMemoryNoteRepository([])
    const createNoteUseCase = new CreateNote(emptyNoteRepository, new InMemoryUserRepository([aUser]))
    const createNoteController = new CreateNoteController(createNoteUseCase)
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
})
