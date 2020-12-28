import { NoteRepository } from '../../../src/use-cases/create-note/ports/note-repository'
import { RemoveNote } from '../../../src/use-cases/remove-note/remove-note'
import { InMemoryNoteRepository } from '../create-note/in-memory-note-repository'

describe('Remove note use case', () => {
  const aNote = {
    title: 'my note',
    content: 'some content',
    ownerId: '0',
    id: '0'
  }
  const noteRepositoryWithANote: NoteRepository = new InMemoryNoteRepository([aNote])

  test('should remove existing note', async () => {
    const usecase = new RemoveNote(noteRepositoryWithANote)
    const removed = await usecase.perform(aNote.id)
    expect(removed).toBe(aNote)
    expect(await noteRepositoryWithANote.findNote(aNote.id)).toBeNull()
  })
})
