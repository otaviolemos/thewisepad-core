import { User } from './user'
import { left } from '../shared/either'
import { InvalidEmailError } from './errors/invalid-email-error'

describe('User domain entity', () => {
  test('should not create user with invalid e-mail address', () => {
    const invalidEmail = 'invalid_email'
    const error = User.create({ email: invalidEmail })
    expect(error).toEqual(left(new InvalidEmailError('invalid_email')))
  })

  test('should create user with valid data', () => {
    const validEmail = 'any@mail.com'
    const user: User = User.create({ email: validEmail }).value as User
    expect(user.email.value).toEqual(validEmail)
  })
})
