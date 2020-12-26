import { NoteData } from '../../../src/use-cases/create-note/note-data'
import { NoteRepository } from '../../../src/use-cases/create-note/ports/note-repository'
import { LoadNotesForUser } from '../../../src/use-cases/load-notes-for-user/load-notes-for-user'
import { InMemoryNoteRepository } from '../create-note/in-memory-note-repository'

describe('Load notes for user use case', () => {
  const validTitle1 = 'my note'
  const validTitle2 = 'my second note'
  const validUserId = '0'
  const someContent = 'some content'
  const someOtherContent = 'some other content'
  const note1: NoteData = {
    title: validTitle1,
    content: someContent,
    ownerId: validUserId,
    id: '0'
  }
  const note2: NoteData = {
    title: validTitle2,
    content: someOtherContent,
    ownerId: validUserId,
    id: '1'
  }
  const noteRepositoryWithTwoNotes: NoteRepository = new InMemoryNoteRepository(
    [note1, note2]
  )

  test('should correctly load notes for a registered user', async () => {
    const usecase: LoadNotesForUser = new LoadNotesForUser(noteRepositoryWithTwoNotes)
    const notes: NoteData[] = await usecase.perform(validUserId)
    expect(notes.length).toEqual(2)
    expect(notes[0].title).toEqual(validTitle1)
    expect(notes[1].title).toEqual(validTitle2)
  })

  test('should fail to load notes for user without notes', async () => {
    const usecase: LoadNotesForUser = new LoadNotesForUser(noteRepositoryWithTwoNotes)
    const notes: NoteData[] = await usecase.perform('1')
    expect(notes.length).toEqual(0)
  })
})
