import { NoteRepository } from '../../../src/use-cases/ports/note-repository'
import { RemoveNote } from '../../../src/use-cases/remove-note/remove-note'
import { NoteBuilder } from '../builders/note-builder'
import { InMemoryNoteRepository } from '../repositories/in-memory-note-repository'

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
