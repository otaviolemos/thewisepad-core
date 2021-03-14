import { SignUp } from '@/use-cases/sign-up'
import { SignUpController } from '@/presentation/controllers'
import { MongodbUserRepository } from '@/external/repositories/mongodb/mondodb-user-repository'
import { BcryptEncoder } from '@/external/encoder'
import { CustomAuthentication } from '@/use-cases/authentication'
import { JwtTokenManager } from '@/external/token-manager'

export const makeSignUpController = (): SignUpController => {
  const userRepository = new MongodbUserRepository()
  const encoder = new BcryptEncoder(10)
  const authenticationService = new CustomAuthentication(userRepository, encoder, new JwtTokenManager(process.env.JWT_SECRET))
  const usecase = new SignUp(userRepository, encoder, authenticationService)
  const controller = new SignUpController(usecase)
  return controller
}
