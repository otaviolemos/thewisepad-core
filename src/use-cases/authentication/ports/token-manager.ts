import { Either } from '@/shared'

export interface TokenManager {
  sign (info: string): Promise<string>
  verify (token: string): Promise<Either<Error, string>>
}
