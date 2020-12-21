import { User } from '../../src/entities/user'
import { left } from '../../src/shared/either'
import { InvalidEmailError } from '../../src/entities/errors/invalid-email-error'
import { InvalidPasswordError } from '../../src/entities/errors/invalid-password-error'

const validEmail = 'any@mail.com'
const validPassword = '1validpassword'
const invalidEmail = 'invalid_email'
const invalidPasswordWithNoNumbers = 'invalid'
const invalidPasswordWithTooFewCharacters = '123ab'

describe('User domain entity', () => {
  test('should not create user with invalid e-mail address', () => {
    const error = User.create({ email: invalidEmail, password: validPassword })
    expect(error).toEqual(left(new InvalidEmailError(invalidEmail)))
  })

  test('should not create user with invalid password (no numbers)', () => {
    const error = User.create({ email: validEmail, password: invalidPasswordWithNoNumbers })
    expect(error).toEqual(left(new InvalidPasswordError()))
  })

  test('should not create user with invalid password (too few chars)', () => {
    const error = User.create({ email: validEmail, password: invalidPasswordWithTooFewCharacters })
    expect(error).toEqual(left(new InvalidPasswordError()))
  })

  test('should create user with valid data', () => {
    const user: User = User.create({ email: validEmail, password: validPassword }).value as User
    expect(user.email.value).toEqual(validEmail)
    expect(user.password.value).toEqual(validPassword)
  })
})
