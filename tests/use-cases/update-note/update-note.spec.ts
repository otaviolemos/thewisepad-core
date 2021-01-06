import { NoteData } from '../../../src/use-cases/ports/note-data'
import { NoteRepository } from '../../../src/use-cases/ports/note-repository'
import { UserRepository } from '../../../src/use-cases/ports/user-repository'
import { UpdateNote } from '../../../src/use-cases/update-note/update-note'
import { NoteBuilder } from '../builders/note-builder'
import { UserBuilder } from '../builders/user-builder'
import { InMemoryNoteRepository } from '../repositories/in-memory-note-repository'
import { InMemoryUserRepository } from '../repositories/in-memory-user-repository'

describe('Update note use case', () => {
  test('should update title and content of existing note', async () => {
    const originalNote: NoteData = NoteBuilder.aNote().build()
    const changedNote: NoteData =
      NoteBuilder.aNote().withDifferentTitleAndContent().build()
    const owner = UserBuilder.aUser().build()
    const noteRepositoryWithANote: NoteRepository = new InMemoryNoteRepository([originalNote])
    const userRepositoryWithAUser: UserRepository = new InMemoryUserRepository([
      owner
    ])
    const usecase = new UpdateNote(noteRepositoryWithANote, userRepositoryWithAUser)
    const response = (await usecase.perform(originalNote.id, changedNote)).value as NoteData
    expect(response.title).toEqual(changedNote.title)
    expect(response.content).toEqual(changedNote.content)
  })
})
