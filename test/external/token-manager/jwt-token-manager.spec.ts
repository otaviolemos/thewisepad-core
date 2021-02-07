import { JwtTokenManager } from '@/external/token-manager'
import { Payload } from '@/use-cases/authentication/ports'
import * as sinon from 'sinon'

describe('JWT token manager', () => {
  test('should correctly sign and verify a json web token', async () => {
    const secret = 'my secret'
    const tokenManager = new JwtTokenManager(secret)
    const info: Payload = { id: 'my id' }
    const signedToken = await tokenManager.sign(info)
    const response = await tokenManager.verify(signedToken)
    expect(signedToken).not.toEqual(info)
    expect(response).toHaveProperty('value.id')
    expect(response.isRight()).toBeTruthy()
  })

  test('should correctly verify invalid json web token', async () => {
    const secret = 'my secret'
    const tokenManager = new JwtTokenManager(secret)
    const info: Payload = { id: 'my id' }
    const signedToken = await tokenManager.sign(info)
    const invalidToken = signedToken + 'some trash'
    expect((await tokenManager.verify(invalidToken)).isLeft()).toBeTruthy()
  })

  test('should correctly verify expired json web tokens', async () => {
    const clock = sinon.useFakeTimers()
    const secret = 'my secret'
    const tokenManager = new JwtTokenManager(secret)
    const info: Payload = { id: 'my id' }
    const exp = '1h'
    const signedToken = await tokenManager.sign(info, exp)
    clock.tick(3600100)
    expect(signedToken).not.toEqual(info)
    expect(((await (tokenManager.verify(signedToken))).value as Error).name).toEqual('TokenExpiredError')
    clock.restore()
  })
})
