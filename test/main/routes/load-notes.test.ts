import { MongoHelper } from '@/external/repositories/mongodb/helpers'
import { UserBuilder, NoteBuilder } from '@test/builders'
import { makeNoteRepository, makeUserRepository, makeEncoder, makeTokenManager } from '@/main/factories'
import app from '@/main/config/app'
import request from 'supertest'

describe('Load notes route', () => {
  let validUser = UserBuilder.aUser().build()
  let aNote = NoteBuilder.aNote().build()
  let aSecondNote = NoteBuilder.aNote().withDifferentTitleAndId().build()
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
    aSecondNote = await noteRepo.add({
      title: aSecondNote.title,
      content: aSecondNote.content,
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

  test('should be able to load notes for valid user', async () => {
    await request(app)
      .get('/api/notes/')
      .set('x-access-token', token)
      .send({
        userId: aNote.ownerId
      })
      .expect(200)
      .then((res) => {
        expect((res.body as []).length).toEqual(2)
      })
  })
})
