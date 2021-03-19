import { Encoder } from '@/use-cases/ports'
import { BcryptEncoder } from '@/external/encoder/'

export const makeEncoder = (): Encoder => {
  return new BcryptEncoder(parseInt(process.env.BCRYPT_ROUNDS))
}
