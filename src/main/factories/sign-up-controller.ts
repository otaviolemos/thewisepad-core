import { SignUp } from '@/use-cases/sign-up'
import { SignUpController } from '@/web-controllers/'
import { InMemoryUserRepository } from '@test/use-cases/repositories'
import { FakeEncoder } from '@test/use-cases/encoders'
import makeAuthenticationStub from './authentication-stub'

export const makeSignUpController = (): SignUpController => {
  const userRepository = new InMemoryUserRepository([])
  const encoder = new FakeEncoder()
  const usecase = new SignUp(userRepository, encoder, makeAuthenticationStub())
  const controller = new SignUpController(usecase)
  return controller
}
