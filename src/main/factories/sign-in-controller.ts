import { SignIn } from '@/use-cases/sign-in'
import { SignInController } from '@/presentation/controllers'
import { MongodbUserRepository } from '@/external/repositories/mongodb/mondodb-user-repository'
import { BcryptEncoder } from '@/external/encoder'
import { CustomAuthentication } from '@/use-cases/authentication'
import { JwtTokenManager } from '@/external/token-manager'

export const makeSignInController = (): SignInController => {
  const userRepository = new MongodbUserRepository()
  const encoder = new BcryptEncoder(parseInt(process.env.BCRYPT_ROUNDS))
  const authenticationService = new CustomAuthentication(userRepository, encoder, new JwtTokenManager(process.env.JWT_SECRET))
  const usecase = new SignIn(authenticationService)
  const controller = new SignInController(usecase)
  return controller
}
