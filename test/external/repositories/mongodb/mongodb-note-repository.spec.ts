import { MongoHelper } from '@/external/repositories/mongodb/helpers'
import { MongodbNoteRepository } from '@/external/repositories/mongodb/mongodb-note-repository'
import { NoteData, UserData } from '@/use-cases/ports'
import { NoteBuilder, UserBuilder } from '@test/builders'
import { MongodbUserRepository } from '@/external/repositories/mongodb'

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
    const userRepository = new MongodbUserRepository()
    const user: UserData = await userRepository.add(UserBuilder.aUser().build())
    let aValidNote = NoteBuilder.aNote().build()
    aValidNote.ownerId = user.id
    aValidNote = await repository.add(aValidNote)
    const foundNote: NoteData[] = await repository.findAllNotesFrom(aValidNote.ownerId)
    expect(foundNote.length).toEqual(1)
    expect(foundNote[0].title).toEqual(aValidNote.title)
  })

  test('should remove existing note', async () => {
    const repository = new MongodbNoteRepository()
    const aValidNote = NoteBuilder.aNote().build()
    const addedNote: NoteData = await repository.add(aValidNote)
    const foundNote = await repository.findById(addedNote.id)
    expect(foundNote).toBeDefined()
    await repository.remove(foundNote.id)
    const removedNote = await repository.findById(addedNote.id)
    expect(removedNote).toBeNull()
  })

  test('should update title of existing note', async () => {
    const repository = new MongodbNoteRepository()
    const aValidNote = NoteBuilder.aNote().build()
    const addedNote: NoteData = await repository.add(aValidNote)
    await repository.updateTitle(addedNote.id, 'New title')
    const updatedNote = await repository.findById(addedNote.id)
    expect(updatedNote.title).toEqual('New title')
  })

  test('should update content of existing note', async () => {
    const repository = new MongodbNoteRepository()
    const aValidNote = NoteBuilder.aNote().build()
    const addedNote: NoteData = await repository.add(aValidNote)
    await repository.updateContent(addedNote.id, 'New content')
    const updatedNote = await repository.findById(addedNote.id)
    expect(updatedNote.content).toEqual('New content')
  })
})
