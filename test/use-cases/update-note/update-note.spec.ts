import { NoteData, NoteRepository, UserRepository } from '@/use-cases/ports'
import { UpdateNoteRequest, UpdateNote } from '@/use-cases/update-note'
import { InMemoryNoteRepository, InMemoryUserRepository } from '@test/doubles/repositories'
import { UserBuilder, NoteBuilder } from '@test/builders'
import { ExistingTitleError } from '@/use-cases/create-note/errors'
import { InvalidTitleError } from '@/entities/errors'
import { UnexistingNoteError } from '@/use-cases/remove-note/errors'

describe('Update note use case', () => {
  test('should update title and content of existing note', async () => {
    const originalNote: NoteData = NoteBuilder.aNote().build()
    const noteWithDifferentTitleAndContent: NoteData = NoteBuilder.aNote().withDifferentTitleAndContent().build()
    const changedNote: UpdateNoteRequest = {
      title: noteWithDifferentTitleAndContent.title,
      content: noteWithDifferentTitleAndContent.content,
      id: originalNote.id,
      ownerEmail: originalNote.ownerEmail,
      ownerId: originalNote.ownerId
    }
    const owner = UserBuilder.aUser().build()
    const noteRepositoryWithANote: NoteRepository = new InMemoryNoteRepository([originalNote])
    const userRepositoryWithAUser: UserRepository = new InMemoryUserRepository([
      owner
    ])
    const usecase = new UpdateNote(noteRepositoryWithANote, userRepositoryWithAUser)
    const response = (await usecase.perform(changedNote)).value as NoteData
    expect(response.title).toEqual(changedNote.title)
    expect(response.content).toEqual(changedNote.content)
  })

  test('should not update title of existing note if user already has note with same title', async () => {
    const originalNote: NoteData = NoteBuilder.aNote().build()
    const aSecondNote: NoteData = NoteBuilder.aNote().withDifferentTitleAndContent().build()
    const changedNote: UpdateNoteRequest = {
      title: aSecondNote.title,
      ownerEmail: originalNote.ownerEmail,
      content: originalNote.content,
      id: originalNote.id,
      ownerId: originalNote.ownerId
    }
    const owner = UserBuilder.aUser().build()
    const noteRepositoryWithANote: NoteRepository = new InMemoryNoteRepository([originalNote, aSecondNote])
    const userRepositoryWithAUser: UserRepository = new InMemoryUserRepository([
      owner
    ])
    const usecase = new UpdateNote(noteRepositoryWithANote, userRepositoryWithAUser)
    const response = (await usecase.perform(changedNote)).value as Error
    expect(response).toBeInstanceOf(ExistingTitleError)
  })

  test('should update title of existing note', async () => {
    const originalNote: NoteData = NoteBuilder.aNote().build()
    const changedNote = {
      title: 'A different title',
      ownerEmail: originalNote.ownerEmail,
      id: originalNote.id,
      ownerId: originalNote.ownerId
    }
    const owner = UserBuilder.aUser().build()
    const noteRepositoryWithANote: NoteRepository = new InMemoryNoteRepository([originalNote])
    const userRepositoryWithAUser: UserRepository = new InMemoryUserRepository([
      owner
    ])
    const usecase = new UpdateNote(noteRepositoryWithANote, userRepositoryWithAUser)
    const response = (await usecase.perform(changedNote)).value as NoteData
    expect(response.title).toEqual(changedNote.title)
  })

  test('should update content of existing note', async () => {
    const originalNote: NoteData = NoteBuilder.aNote().build()
    const changedNote = {
      ownerEmail: originalNote.ownerEmail,
      id: originalNote.id,
      ownerId: originalNote.ownerId,
      content: 'A different content'
    }
    const owner = UserBuilder.aUser().build()
    const noteRepositoryWithANote: NoteRepository = new InMemoryNoteRepository([originalNote])
    const userRepositoryWithAUser: UserRepository = new InMemoryUserRepository([
      owner
    ])
    const usecase = new UpdateNote(noteRepositoryWithANote, userRepositoryWithAUser)
    const response = (await usecase.perform(changedNote)).value as NoteData
    expect(response.content).toEqual(changedNote.content)
  })

  test('should update content of existing note to empty content', async () => {
    const originalNote: NoteData = NoteBuilder.aNote().build()
    const changedNote = {
      ownerEmail: originalNote.ownerEmail,
      id: originalNote.id,
      ownerId: originalNote.ownerId,
      content: ''
    }
    const owner = UserBuilder.aUser().build()
    const noteRepositoryWithANote: NoteRepository = new InMemoryNoteRepository([originalNote])
    const userRepositoryWithAUser: UserRepository = new InMemoryUserRepository([
      owner
    ])
    const usecase = new UpdateNote(noteRepositoryWithANote, userRepositoryWithAUser)
    const response = (await usecase.perform(changedNote)).value as NoteData
    expect(response.content).toEqual(changedNote.content)
  })

  test('should not update title with invalid title', async () => {
    const originalNote: NoteData = NoteBuilder.aNote().build()
    const changedNote = {
      title: ' ',
      ownerEmail: originalNote.ownerEmail,
      id: originalNote.id,
      ownerId: originalNote.ownerId
    }
    const owner = UserBuilder.aUser().build()
    const noteRepositoryWithANote: NoteRepository = new InMemoryNoteRepository([originalNote])
    const userRepositoryWithAUser: UserRepository = new InMemoryUserRepository([
      owner
    ])
    const usecase = new UpdateNote(noteRepositoryWithANote, userRepositoryWithAUser)
    const response = (await usecase.perform(changedNote)).value as Error
    expect(response).toBeInstanceOf(InvalidTitleError)
  })

  test('should not update unexisting note', async () => {
    const originalNote: NoteData = NoteBuilder.aNote().build()
    const changedNote = {
      title: originalNote.title,
      ownerEmail: originalNote.ownerEmail,
      id: originalNote.id,
      ownerId: originalNote.ownerId
    }
    const owner = UserBuilder.aUser().build()
    const noteRepositoryWithANote: NoteRepository = new InMemoryNoteRepository([])
    const userRepositoryWithAUser: UserRepository = new InMemoryUserRepository([
      owner
    ])
    const usecase = new UpdateNote(noteRepositoryWithANote, userRepositoryWithAUser)
    const response = (await usecase.perform(changedNote)).value as Error
    expect(response).toBeInstanceOf(UnexistingNoteError)
  })
})
