import request from 'supertest'
import app from '@/main/config/app'
import { MongoHelper } from '@/external/repositories/mongodb/helpers'

describe('Signin route', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL)
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  test('should successfully sign in', async () => {
    app.post('/test_cors', (req, res) => {
      res.send()
    })
    await request(app)
      .post('/api/signup')
      .send({
        email: 'any@mail.com',
        password: '1validpassword'
      })
    app.post('/test_cors', (req, res) => {
      res.send()
    })
    await request(app)
      .post('/api/signin')
      .send({
        email: 'any@mail.com',
        password: '1validpassword'
      })
      .expect(200)
      .then((res) => {
        expect(res.body.accessToken).toBeDefined()
        expect(res.body.id).toBeDefined()
      })
  })
})
