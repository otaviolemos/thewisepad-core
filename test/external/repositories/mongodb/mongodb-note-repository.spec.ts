import { MongoHelper } from '@/external/repositories/mongodb/helpers'
import { MongodbNoteRepository } from '@/external/repositories/mongodb/mongodb-note-repository'
import { NoteData } from '@/use-cases/ports'
import { NoteBuilder } from '@test/builders'

describe('Mongodb User repository', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL)
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    await MongoHelper.clearCollection('notes')
  })

  test('should add valid note', async () => {
    const repository = new MongodbNoteRepository()
    const aValidNote = NoteBuilder.aNote().build()
    const addedNote: NoteData = await repository.add(aValidNote)
    const foundNote = await repository.findById(addedNote.id)
    expect(foundNote).toBeDefined()
  })

  test('should find all notes from a user', async () => {
    const repository = new MongodbNoteRepository()
    const aValidNote = NoteBuilder.aNote().build()
    await repository.add(aValidNote)
    const foundNote: NoteData[] = await repository.findAllNotesFrom(aValidNote.ownerId)
    expect(foundNote.length).toEqual(1)
    expect(foundNote[0].title).toEqual(aValidNote.title)
  })
})
