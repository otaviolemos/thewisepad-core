import { Encoder } from '../../../src/use-cases/ports/encoder'

export class FakeEncoder implements Encoder {
  public async encode (plain: string): Promise<string> {
    return plain + 'ENCRYPTED'
  }

  public async compare (plain: string, hashed: string): Promise<boolean> {
    if (plain + 'ENCRYPTED' === hashed) {
      return true
    }
    return false
  }
}
