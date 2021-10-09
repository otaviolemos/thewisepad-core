import { SignUp } from '@/use-cases/sign-up'
import { SignUpOperation, WebController } from '@/presentation/controllers'
import { CustomAuthentication } from '@/use-cases/authentication'
import { makeTokenManager, makeEncoder } from '@/main/factories'
import { makeUserRepository } from './user-repository'

export const makeSignUpController = (): WebController => {
  const userRepository = makeUserRepository()
  const encoder = makeEncoder()
  const tokenManager = makeTokenManager()
  const authenticationService =
    new CustomAuthentication(userRepository, encoder, tokenManager)
  const usecase = new SignUp(userRepository, encoder, authenticationService)
  const controller = new WebController(new SignUpOperation(usecase))
  return controller
}
