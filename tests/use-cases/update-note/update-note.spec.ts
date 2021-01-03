import { NoteData } from '../../../src/use-cases/ports/note-data'
import { NoteRepository } from '../../../src/use-cases/ports/note-repository'
import { UserRepository } from '../../../src/use-cases/ports/user-repository'
import { UpdateNote } from '../../../src/use-cases/update-note/update-note'
import { InMemoryNoteRepository } from '../repositories/in-memory-note-repository'
import { InMemoryUserRepository } from '../repositories/in-memory-user-repository'

describe('Update note use case', () => {
  const originalTitle = 'my note'
  const changedTitle = 'my changed note'
  const validUserEmail = 'any@mail.com'
  const validUserPassword = '1validpassword'
  const validUserId = '0'
  const originalContent = 'original content'
  const noteId = '0'
  const changedContent = 'changed content'
  const originalNote: NoteData = {
    title: originalTitle,
    content: originalContent,
    ownerEmail: validUserEmail,
    ownerId: validUserId,
    id: noteId
  }
  const changedNote: NoteData = {
    title: changedTitle,
    content: changedContent,
    ownerEmail: validUserEmail
  }
  const noteRepositoryWithANote: NoteRepository = new InMemoryNoteRepository([originalNote])
  const userRepositoryWithAUser: UserRepository = new InMemoryUserRepository([
    {
      email: validUserEmail,
      password: validUserPassword,
      id: validUserId
    }
  ])
  test('should update title and content of existing note', async () => {
    const usecase = new UpdateNote(noteRepositoryWithANote, userRepositoryWithAUser)
    const response = (await usecase.perform(noteId, changedNote)).value as NoteData
    expect(response.title).toEqual(changedTitle)
    expect(response.content).toEqual(changedContent)
  })
})
