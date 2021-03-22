import { NoteData, NoteRepository } from '@/use-cases/ports'
import { LoadNotes } from '@/use-cases/load-notes'
import { InMemoryNoteRepository } from '@test/doubles/repositories'
import { NoteBuilder } from '@test/builders'

describe('Load notes for user use case', () => {
  test('should correctly load notes for a registered user', async () => {
    const note1: NoteData = NoteBuilder.aNote().build()
    const note2: NoteData = NoteBuilder.aNote().withDifferentTitleAndId().build()
    const noteRepositoryWithTwoNotes: NoteRepository = new InMemoryNoteRepository(
      [note1, note2]
    )
    const usecase: LoadNotes = new LoadNotes(noteRepositoryWithTwoNotes)
    const defaultValidUserId = note1.ownerId
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
    const usecase: LoadNotes = new LoadNotes(noteRepositoryWithTwoNotes)
    const nonDefaultUserId = '1'
    const notes: NoteData[] = await usecase.perform(nonDefaultUserId)
    expect(notes.length).toEqual(0)
  })
})
