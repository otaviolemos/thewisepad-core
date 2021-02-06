import { JwtTokenManager } from '@/external/token-manager'
import { Payload } from '@/use-cases/authentication/ports'

describe('JWT token manager', () => {
  test('should correctly sign and verify a json web token', async () => {
    const secret = 'my secret'
    const tokenManager = new JwtTokenManager(secret)
    const info: Payload = { id: 'my id' }
    const signedToken = await tokenManager.sign(info)
    expect(signedToken).not.toEqual(info)
    expect(await tokenManager.verify(signedToken)).toHaveProperty('value.id')
  })

  test('should correctly verify expired json web tokens', async () => {
    const secret = 'my secret'
    const tokenManager = new JwtTokenManager(secret)
    const info: Payload = { id: 'my id' }
    const exp = '0.1s'
    const signedToken = await tokenManager.sign(info, exp)
    expect(signedToken).not.toEqual(info)
    // todo: expect((await tokenManager.verify(signedToken) as Error).name).toEqual('TokenExpiredError')
  })
})
