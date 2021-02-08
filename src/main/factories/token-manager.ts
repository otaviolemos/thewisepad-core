import { JwtTokenManager } from '@/external/token-manager'
import { TokenManager } from '@/use-cases/authentication/ports'

export const makeTokenManager = (): TokenManager => {
  return new JwtTokenManager(process.env.JWT_SECRET)
}
