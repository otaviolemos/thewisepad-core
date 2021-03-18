import request from 'supertest'
import app from '@/main/config/app'
import { MongoHelper } from '@/external/repositories/mongodb/helpers'
import { MongodbUserRepository } from '@/external/repositories/mongodb/mondodb-user-repository'
import { UserBuilder } from '@test/builders'
import { BcryptEncoder } from '@/external/encoder'

describe('Signin route', () => {
  const validUser = UserBuilder.aUser().build()

  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL)
    const repo = new MongodbUserRepository()
    const encoder = new BcryptEncoder(parseInt(process.env.BCRYPT_ROUNDS))
    await repo.add({
      email: validUser.email,
      password: await encoder.encode(validUser.password)
    })
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  test('should successfully sign in with valid user', async () => {
    app.post('/test_cors', (req, res) => {
      res.send()
    })
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
