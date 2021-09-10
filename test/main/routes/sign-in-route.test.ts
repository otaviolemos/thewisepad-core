import request from 'supertest'
import app from '@/main/config/app'
import { MongoHelper } from '@/external/repositories/mongodb/helpers'
import { UserBuilder } from '@test/builders'
import { makeUserRepository, makeEncoder } from '@/main/factories'

describe('Signin route', () => {
  const validUser = UserBuilder.aUser().build()

  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL)
    await MongoHelper.clearCollection('users')
    const userRepo = makeUserRepository()
    const encoder = makeEncoder()
    await userRepo.add({
      email: validUser.email,
      password: await encoder.encode(validUser.password)
    })
  })

  afterAll(async () => {
    await MongoHelper.clearCollection('users')
    await MongoHelper.disconnect()
  })

  test('should successfully sign in with valid user', async () => {
    await request(app)
      .post('/api/signin')
      .send({
        email: validUser.email,
        password: validUser.password
      })
      .expect(200)
      .then((res) => {
        expect(res.body.accessToken).toBeDefined()
        expect(res.body.id).toBeDefined()
      })
  })
})
