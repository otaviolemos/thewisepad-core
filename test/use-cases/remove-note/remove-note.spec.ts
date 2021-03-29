import { NoteRepository } from '@/use-cases/ports'
import { RemoveNote } from '@/use-cases/remove-note'
import { UnexistingNoteError } from '@/use-cases/remove-note/errors'
import { NoteBuilder } from '@test/builders'
import { InMemoryNoteRepository } from '@test/doubles/repositories'

describe('Remove note use case', () => {
  test('should remove existing note', async () => {
    const aNote =
    NoteBuilder
      .aNote()
      .build()
    const noteRepositoryWithANote: NoteRepository = new InMemoryNoteRepository([aNote])
    const usecase = new RemoveNote(noteRepositoryWithANote)
    await usecase.perform(aNote.id)
    expect(await noteRepositoryWithANote.findById(aNote.id)).toBeNull()
  })

  test('should return error if removing unexisting note', async () => {
    const aNote =
    NoteBuilder
      .aNote()
      .build()
    const anotherNote =
      NoteBuilder
        .aNote()
        .withDifferentTitleAndId()
        .build()
    const noteRepositoryWithANote: NoteRepository = new InMemoryNoteRepository([aNote])
    const usecase = new RemoveNote(noteRepositoryWithANote)
    const error = (await usecase.perform(anotherNote.id)).value as Error
    expect(error).toBeInstanceOf(UnexistingNoteError)
  })
})
