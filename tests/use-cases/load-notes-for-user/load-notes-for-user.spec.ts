import { NoteData } from '../../../src/use-cases/ports/note-data'
import { NoteRepository } from '../../../src/use-cases/ports/note-repository'
import { LoadNotesForUser } from '../../../src/use-cases/load-notes-for-user/load-notes-for-user'
import { InMemoryNoteRepository } from '../repositories/in-memory-note-repository'
import { NoteBuilder } from '../builders/note-builder'

describe('Load notes for user use case', () => {
  test('should correctly load notes for a registered user', async () => {
    const note1: NoteData = NoteBuilder.aNote().build()
    const note2: NoteData = NoteBuilder.aNote().withDifferentTitleAndId().build()
    const noteRepositoryWithTwoNotes: NoteRepository = new InMemoryNoteRepository(
      [note1, note2]
    )
    const usecase: LoadNotesForUser = new LoadNotesForUser(noteRepositoryWithTwoNotes)
    const defaultValidUserId = '0'
    const notes: NoteData[] = await usecase.perform(defaultValidUserId)
    expect(notes.length).toEqual(2)
    expect(notes[0].title).toEqual(note1.title)
    expect(notes[1].title).toEqual(note2.title)
  })

  test('should fail to load notes for user without notes', async () => {
    const note1: NoteData = NoteBuilder.aNote().build()
    const note2: NoteData = NoteBuilder.aNote().withDifferentTitleAndId().build()
    const noteRepositoryWithTwoNotes: NoteRepository = new InMemoryNoteRepository(
      [note1, note2]
    )
    const usecase: LoadNotesForUser = new LoadNotesForUser(noteRepositoryWithTwoNotes)
    const notes: NoteData[] = await usecase.perform('1')
    expect(notes.length).toEqual(0)
  })
})
