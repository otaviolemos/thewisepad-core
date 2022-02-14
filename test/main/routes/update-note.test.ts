import { MongoHelper } from '@/external/repositories/mongodb/helpers'
import { UserBuilder, NoteBuilder } from '@test/builders'
import { makeNoteRepository, makeUserRepository, makeEncoder, makeTokenManager } from '@/main/factories'
import app from '@/main/config/app'
import request from 'supertest'

describe('Update note route', () => {
  let validUser = UserBuilder.aUser().build()
  let aNote = NoteBuilder.aNote().build()
  let token = null

  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL)
    await MongoHelper.clearCollection('users')
    await MongoHelper.clearCollection('notes')
    const userRepo = makeUserRepository()
    const noteRepo = makeNoteRepository()
    const encoder = makeEncoder()
    const tokenManager = makeTokenManager()
    validUser = await userRepo.add({
      email: validUser.email,
      password: await encoder.encode(validUser.password)
    })
    aNote = await noteRepo.add({
      title: aNote.title,
      content: aNote.content,
      ownerEmail: validUser.email,
      ownerId: validUser.id
    })
    token = await tokenManager.sign({ id: validUser.id })
  })

  afterAll(async () => {
    await MongoHelper.clearCollection('users')
    await MongoHelper.clearCollection('notes')
    await MongoHelper.disconnect()
  })

  test('should be able to update title of existing note for valid user', async () => {
    const newTitle = 'a new title'
    await request(app)
      .put('/api/notes/' + aNote.id)
      .set('x-access-token', token)
      .send({
        id: aNote.id,
        title: newTitle,
        ownerEmail: aNote.ownerEmail,
        ownerId: aNote.ownerId
      })
      .expect(200)
      .then((res) => {
        expect(res.body.title).toEqual(newTitle)
      })
  })

  test('should be able to update content of existing note for valid user', async () => {
    const newContent = 'new content'
    await request(app)
      .put('/api/notes/' + aNote.id)
      .set('x-access-token', token)
      .send({
        id: aNote.id,
        content: newContent,
        ownerEmail: aNote.ownerEmail,
        ownerId: aNote.ownerId
      })
      .expect(200)
      .then((res) => {
        expect(res.body.content).toEqual(newContent)
      })
  })
})
