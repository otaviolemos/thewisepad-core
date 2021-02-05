import request from 'supertest'
import app from '@/main/config/app'

describe('Register Routes', () => {
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
      .expect(201, {
        accessToken: 'accessToken',
        id: '0'
      })
  })
})
