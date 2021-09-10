import { MongoHelper } from '@/external/repositories/mongodb/helpers'
import { UserBuilder, NoteBuilder } from '@test/builders'
import { makeUserRepository, makeEncoder, makeTokenManager } from '@/main/factories'
import app from '@/main/config/app'
import request from 'supertest'

describe('Create note route', () => {
  let validUser = UserBuilder.aUser().build()
  const aNote = NoteBuilder.aNote().build()
  let token = null

  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL)
    await MongoHelper.clearCollection('users')
    await MongoHelper.clearCollection('notes')
    const userRepo = makeUserRepository()
    const encoder = makeEncoder()
    const tokenManager = makeTokenManager()
    validUser = await userRepo.add({
      email: validUser.email,
      password: await encoder.encode(validUser.password)
    })
    token = await tokenManager.sign({ id: validUser.id })
  })

  afterAll(async () => {
    await MongoHelper.clearCollection('users')
    await MongoHelper.clearCollection('notes')
    await MongoHelper.disconnect()
  })

  test('should be able to create note for valid user', async () => {
    await request(app)
      .post('/api/notes')
      .set('x-access-token', token)
      .send({
        title: aNote.title,
        content: aNote.content,
        ownerEmail: aNote.ownerEmail,
        ownerId: validUser.id
      })
      .expect(201)
  })
})
