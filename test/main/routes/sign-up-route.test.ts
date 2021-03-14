import request from 'supertest'
import app from '@/main/config/app'
import { MongoHelper } from '@/external/repositories/mongodb/helpers'

describe('Signup route', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL)
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  test('should return an account on success', async () => {
    app.post('/test_cors', (req, res) => {
      res.send()
    })
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
