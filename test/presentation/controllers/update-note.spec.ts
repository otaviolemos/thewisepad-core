import { InvalidTitleError } from '@/entities/errors'
import { MissingParamError } from '@/presentation/controllers/errors'
import { HttpRequest, HttpResponse } from '@/presentation/controllers/ports'
import { UpdateNoteOperation } from '@/presentation/controllers/update-note'
import { NoteData, NoteRepository, UserRepository } from '@/use-cases/ports'
import { UpdateNote, UpdateNoteRequest } from '@/use-cases/update-note'
import { NoteBuilder, UserBuilder } from '@test/builders'
import { InMemoryNoteRepository, InMemoryUserRepository } from '@test/doubles/repositories'
import { ErrorThrowingUseCaseStub } from '@test/doubles/usecases'
import { WebController } from '@/presentation/controllers'
import { UnexistingNoteError } from '@/use-cases/remove-note/errors'

describe('Update note controller', () => {
  test('should return 200 and updated note when note is updated', async () => {
    const originalNote: NoteData = NoteBuilder.aNote().build()
    const noteWithDifferentTitleAndContent: NoteData = NoteBuilder.aNote().withDifferentTitleAndContent().build()
    const changedNote: UpdateNoteRequest = {
      title: noteWithDifferentTitleAndContent.title,
      content: noteWithDifferentTitleAndContent.content,
      id: originalNote.id,
      ownerEmail: originalNote.ownerEmail,
      ownerId: originalNote.ownerId
    }
    const request: HttpRequest = {
      body: changedNote
    }
    const owner = UserBuilder.aUser().build()
    const noteRepositoryWithANote: NoteRepository = new InMemoryNoteRepository([originalNote])
    const userRepositoryWithAUser: UserRepository = new InMemoryUserRepository([
      owner
    ])
    const usecase = new UpdateNote(noteRepositoryWithANote, userRepositoryWithAUser)
    const controller = new WebController(new UpdateNoteOperation(usecase))
    const response: HttpResponse = await controller.handle(request)
    expect(response.statusCode).toEqual(200)
    expect((response.body as NoteData).content).toEqual(changedNote.content)
    expect((response.body as NoteData).title).toEqual(changedNote.title)
  })

  test('should return 400 when trying to update unexisting note', async () => {
    const originalNote: NoteData = NoteBuilder.aNote().build()
    const changedNote: UpdateNoteRequest = {
      title: originalNote.title,
      id: originalNote.id,
      ownerEmail: originalNote.ownerEmail,
      ownerId: originalNote.ownerId
    }
    const request: HttpRequest = {
      body: changedNote
    }
    const owner = UserBuilder.aUser().build()
    const noteRepositoryWithANote: NoteRepository = new InMemoryNoteRepository([])
    const userRepositoryWithAUser: UserRepository = new InMemoryUserRepository([
      owner
    ])
    const usecase = new UpdateNote(noteRepositoryWithANote, userRepositoryWithAUser)
    const controller = new WebController(new UpdateNoteOperation(usecase))
    const response: HttpResponse = await controller.handle(request)
    expect(response.statusCode).toEqual(400)
    expect(response.body).toBeInstanceOf(UnexistingNoteError)
  })

  test('should return 400 when trying to update note with invalid title', async () => {
    const originalNote: NoteData = NoteBuilder.aNote().build()
    const changedNote: UpdateNoteRequest = {
      title: '',
      id: originalNote.id,
      ownerEmail: originalNote.ownerEmail,
      ownerId: originalNote.ownerId
    }
    const request: HttpRequest = {
      body: changedNote
    }
    const owner = UserBuilder.aUser().build()
    const noteRepositoryWithANote: NoteRepository = new InMemoryNoteRepository([originalNote])
    const userRepositoryWithAUser: UserRepository = new InMemoryUserRepository([
      owner
    ])
    const usecase = new UpdateNote(noteRepositoryWithANote, userRepositoryWithAUser)
    const controller = new WebController(new UpdateNoteOperation(usecase))
    const response: HttpResponse = await controller.handle(request)
    expect(response.statusCode).toEqual(400)
    expect(response.body).toBeInstanceOf(InvalidTitleError)
  })

  test('should return 400 when request does not contain title nor content', async () => {
    const originalNote: NoteData = NoteBuilder.aNote().build()
    const noteWithNoTitleNorContent = {
      id: originalNote.id,
      ownerEmail: originalNote.ownerEmail,
      ownerId: originalNote.ownerId
    }
    const requestWithNoTitleNorContent: HttpRequest = {
      body: noteWithNoTitleNorContent
    }
    const owner = UserBuilder.aUser().build()
    const noteRepositoryWithANote: NoteRepository = new InMemoryNoteRepository([originalNote])
    const userRepositoryWithAUser: UserRepository = new InMemoryUserRepository([
      owner
    ])
    const usecase = new UpdateNote(noteRepositoryWithANote, userRepositoryWithAUser)
    const controller = new WebController(new UpdateNoteOperation(usecase))
    const response: HttpResponse = await controller.handle(requestWithNoTitleNorContent)
    expect(response.statusCode).toEqual(400)
    expect(response.body).toBeInstanceOf(MissingParamError)
    expect((response.body as Error).message).toEqual('Missing parameter: title, content.')
  })

  test('should return 400 when request does not contain note id', async () => {
    const originalNote: NoteData = NoteBuilder.aNote().build()
    const noteWithNoId = {
      title: 'Different title',
      content: originalNote.content,
      ownerEmail: originalNote.ownerEmail,
      ownerId: originalNote.ownerId
    }
    const requestWithNoTitleNorContent: HttpRequest = {
      body: noteWithNoId
    }
    const owner = UserBuilder.aUser().build()
    const noteRepositoryWithANote: NoteRepository = new InMemoryNoteRepository([originalNote])
    const userRepositoryWithAUser: UserRepository = new InMemoryUserRepository([
      owner
    ])
    const usecase = new UpdateNote(noteRepositoryWithANote, userRepositoryWithAUser)
    const controller = new WebController(new UpdateNoteOperation(usecase))
    const response: HttpResponse = await controller.handle(requestWithNoTitleNorContent)
    expect(response.statusCode).toEqual(400)
    expect(response.body).toBeInstanceOf(MissingParamError)
    expect((response.body as Error).message).toEqual('Missing parameter: id.')
  })

  test('should return 500 if an error is raised internally', async () => {
    const errorThrowingSignUpUseCaseStub = new ErrorThrowingUseCaseStub()
    const controllerWithStubUseCase = new WebController(new UpdateNoteOperation(errorThrowingSignUpUseCaseStub))
    const originalNote: NoteData = NoteBuilder.aNote().build()
    const noteWithDifferentTitleAndContent: NoteData = NoteBuilder.aNote().withDifferentTitleAndContent().build()
    const changedNote: UpdateNoteRequest = {
      title: noteWithDifferentTitleAndContent.title,
      content: noteWithDifferentTitleAndContent.content,
      id: originalNote.id,
      ownerEmail: originalNote.ownerEmail,
      ownerId: originalNote.ownerId
    }
    const validRequest: HttpRequest = {
      body: changedNote
    }
    const response: HttpResponse = await controllerWithStubUseCase.handle(validRequest)
    expect(response.statusCode).toEqual(500)
    expect(response.body).toBeInstanceOf(Error)
  })
})
