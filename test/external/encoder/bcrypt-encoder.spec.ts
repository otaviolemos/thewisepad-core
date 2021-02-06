import { BcryptEncoder } from '@/external/encoder'

describe('Bcrypt encoder', () => {
  test('should correctly encode and decode a string', async () => {
    const rounds = 10
    const encoder = new BcryptEncoder(rounds)
    const password = 'my password'
    const encodedPassword = await encoder.encode(password)
    expect(password).not.toEqual(encodedPassword)
    expect(await encoder.compare(password, encodedPassword)).toBeTruthy()
  })
})
