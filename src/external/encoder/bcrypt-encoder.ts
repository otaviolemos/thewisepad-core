import { Encoder } from '@/use-cases/ports'
import * as bcrypt from 'bcrypt'

export class BcryptEncoder implements Encoder {
  private readonly rounds: number = 10

  constructor (rounds: number) {
    this.rounds = rounds
  }

  async encode (plain: string): Promise<string> {
    return await bcrypt.hash(plain, this.rounds)
  }

  async compare (plain: string, hashed: string): Promise<boolean> {
    return await bcrypt.compare(plain, hashed)
  }
}
