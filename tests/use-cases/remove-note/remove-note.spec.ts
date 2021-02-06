import { NoteRepository } from '@/use-cases/ports'
import { RemoveNote } from '@/use-cases/remove-note'
import { NoteBuilder } from '@test/use-cases/builders'
import { InMemoryNoteRepository } from '@test/use-cases/doubles/repositories'

describe('Remove note use case', () => {
  test('should remove existing note', async () => {
    const aNote =
    NoteBuilder
      .aNote()
      .build()
    const noteRepositoryWithANote: NoteRepository = new InMemoryNoteRepository([aNote])
    const usecase = new RemoveNote(noteRepositoryWithANote)
    const removed = await usecase.perform(aNote.id)
    expect(removed).toBe(aNote)
    expect(await noteRepositoryWithANote.findById(aNote.id)).toBeNull()
  })
})
