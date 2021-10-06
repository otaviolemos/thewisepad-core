import { JwtTokenManager } from '@/external/token-manager'
import { Payload } from '@/use-cases/authentication/ports'
import { TokenExpiredError } from 'jsonwebtoken'
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
    expect(((await (tokenManager.verify(signedToken))).value)).toBeInstanceOf(TokenExpiredError)
    clock.restore()
  })

  test('should correctly verify default expiration of json web tokens - not expired', async () => {
    const clock = sinon.useFakeTimers()
    const secret = 'my secret'
    const tokenManager = new JwtTokenManager(secret)
    const info: Payload = { id: 'my id' }
    const signedToken = await tokenManager.sign(info)
    const twentyNineDays: number = 3600100 * 24 * 29
    clock.tick(twentyNineDays)
    const response = await tokenManager.verify(signedToken)
    expect(signedToken).not.toEqual(info)
    expect(response).toHaveProperty('value.id')
    expect(response.isRight()).toBeTruthy()
    clock.restore()
  })

  test('should correctly verify default expiration of json web tokens - expired', async () => {
    const clock = sinon.useFakeTimers()
    const secret = 'my secret'
    const tokenManager = new JwtTokenManager(secret)
    const info: Payload = { id: 'my id' }
    const signedToken = await tokenManager.sign(info)
    const thirtyOneDays: number = 3600100 * 24 * 31
    clock.tick(thirtyOneDays)
    expect(signedToken).not.toEqual(info)
    expect(((await (tokenManager.verify(signedToken))).value)).toBeInstanceOf(TokenExpiredError)
    clock.restore()
  })
})
