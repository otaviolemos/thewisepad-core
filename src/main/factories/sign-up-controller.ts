import { SignUp } from '@/use-cases/sign-up'
import { SignUpController } from '@/presentation/controllers'
import { InMemoryUserRepository } from '@test/doubles/repositories'
import { FakeEncoder } from '@test/doubles/encoder'
import { makeAuthenticationStub } from '@test/doubles/authentication'

export const makeSignUpController = (): SignUpController => {
  const userRepository = new InMemoryUserRepository([])
  const encoder = new FakeEncoder()
  const usecase = new SignUp(userRepository, encoder, makeAuthenticationStub())
  const controller = new SignUpController(usecase)
  return controller
}
