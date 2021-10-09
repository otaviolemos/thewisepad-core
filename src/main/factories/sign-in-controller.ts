import { SignIn } from '@/use-cases/sign-in'
import { SignInOperation, WebController } from '@/presentation/controllers'
import { CustomAuthentication } from '@/use-cases/authentication'
import { makeUserRepository } from './user-repository'
import { makeEncoder } from './encoder'
import { makeTokenManager } from './token-manager'

export const makeSignInController = (): WebController => {
  const userRepository = makeUserRepository()
  const encoder = makeEncoder()
  const tokenManager = makeTokenManager()
  const authenticationService =
    new CustomAuthentication(userRepository, encoder, tokenManager)
  const usecase = new SignIn(authenticationService)
  const controller = new WebController(new SignInOperation(usecase))
  return controller
}
