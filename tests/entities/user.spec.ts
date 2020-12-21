import { User } from '../../src/entities/user'
import { left } from '../../src/shared/either'
import { InvalidEmailError } from '../../src/entities/errors/invalid-email-error'
import { InvalidPasswordError } from '../../src/entities/errors/invalid-password-error'

describe('User domain entity', () => {
  test('should not create user with invalid e-mail address', () => {
    const invalidEmail = 'invalid_email'
    const validPassword = '1validpassword'
    const error = User.create({ email: invalidEmail, password: validPassword })
    expect(error).toEqual(left(new InvalidEmailError(invalidEmail)))
  })

  test('should not create user with invalid password (no numbers)', () => {
    const validEmail = 'any@mail.com'
    const invalidPassword = 'invalid'
    const error = User.create({ email: validEmail, password: invalidPassword })
    expect(error).toEqual(left(new InvalidPasswordError()))
  })

  test('should not create user with invalid password (too few chars)', () => {
    const validEmail = 'any@mail.com'
    const invalidPassword = '123ab'
    const error = User.create({ email: validEmail, password: invalidPassword })
    expect(error).toEqual(left(new InvalidPasswordError()))
  })

  test('should create user with valid data', () => {
    const validEmail = 'any@mail.com'
    const validPassword = '1validpassword'
    const user: User = User.create({ email: validEmail, password: validPassword }).value as User
    expect(user.email.value).toEqual(validEmail)
    expect(user.password.value).toEqual(validPassword)
  })
})