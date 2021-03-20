import { MongoHelper } from '@/external/repositories/mongodb/helpers'
import { UserBuilder, NoteBuilder } from '@test/builders'
import { makeUserRepository, makeEncoder, makeTokenManager } from '@/main/factories'
import app from '@/main/config/app'
import request from 'supertest'

describe('Signin route', () => {
  let validUser = UserBuilder.aUser().build()
  const aNote = NoteBuilder.aNote().build()
  let anotherUser = UserBuilder.aUser().withDifferentEmail().build()
  let token = null

  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL)
    const userRepo = makeUserRepository()
    const encoder = makeEncoder()
    const tokenManager = makeTokenManager()
    validUser = await userRepo.add({
      email: validUser.email,
      password: await encoder.encode(validUser.password)
    })
    anotherUser = await userRepo.add({
      email: anotherUser.email,
      password: await encoder.encode(anotherUser.password)
    })
    token = tokenManager.sign({ id: validUser.id })
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  test('should not be able to create note for another user', async () => {
    app.post('/test_cors', (req, res) => {
      res.send()
    })
    await request(app)
      .post('/api/notes')
      .set('x-access-token', token)
      .send({
        title: aNote.title,
        content: aNote.content,
        ownerEmail: anotherUser.email,
        ownerId: anotherUser.id
      })
      .expect(403)
  })
})
