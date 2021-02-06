import { Encoder } from '@/use-cases/ports'
import * as bcrypt from 'bcrypt'

export class BcryptEncoder implements Encoder {
  private static readonly rounds: number = 10

  async encode (plain: string): Promise<string> {
    return await bcrypt.hash(plain, BcryptEncoder.rounds)
  }

  async compare (plain: string, hashed: string): Promise<boolean> {
    return await bcrypt.compare(plain, hashed)
  }
}
