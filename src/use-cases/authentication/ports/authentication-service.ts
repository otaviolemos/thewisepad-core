import { Either } from '@/shared'
import { UserNotFoundError, WrongPasswordError } from '@/use-cases/authentication/errors'

export type AuthenticationParams = {
  email: string
  password: string
}

export type AuthenticationResult = {
  accessToken: string
  id: string
}

export interface AuthenticationService {
  auth: (authenticationParams: AuthenticationParams) =>
    Promise<Either<UserNotFoundError | WrongPasswordError, AuthenticationResult>>
}
