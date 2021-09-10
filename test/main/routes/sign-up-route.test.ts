import request from 'supertest'
import app from '@/main/config/app'
import { MongoHelper } from '@/external/repositories/mongodb/helpers'

describe('Signup route', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL)
    await MongoHelper.clearCollection('users')
  })

  afterAll(async () => {
    await MongoHelper.clearCollection('users')
    await MongoHelper.disconnect()
  })

  test('should return access token and id on success', async () => {
    await request(app)
      .post('/api/signup')
      .send({
        email: 'any@mail.com',
        password: '1validpassword'
      })
      .expect(201)
      .then((res) => {
        expect(res.body.accessToken).toBeDefined()
        expect(res.body.id).toBeDefined()
      })
  })
})
