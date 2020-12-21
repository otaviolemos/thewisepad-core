import { UserData } from '../../src/entities/user-data'
import { UserRepository } from '../../src/use-cases/ports/user-repository'
import { InMemoryUserRepository } from './in-memory-user-repository'
import { Encoder } from '../../src/use-cases/signup/ports/encoder'
import { FakeEncoder } from './signup/fake-encoder'
import { Signup } from '../../src/use-cases/signup'

describe('Signup use case', () => {
  test('should signup user with valid data', async () => {
    const validEmail = 'any@mail.com'
    const validPassword = '1validpassword'
    const userSignupRequest: UserData = { email: validEmail, password: validPassword }
    const userRepository: UserRepository = new InMemoryUserRepository([])
    const encoder: Encoder = new FakeEncoder()
    const usecase: Signup = new Signup(userRepository, encoder)
    const userSignupResponse: UserData = await usecase.perform(userSignupRequest)
    expect(userSignupResponse).toEqual(userSignupRequest)
    expect((await userRepository.findAllUsers()).length).toEqual(1)
    expect((await userRepository.findUserByEmail(validEmail)).password).toEqual(validPassword + 'ENCRYPTED')
  })
})
