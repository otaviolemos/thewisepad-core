import { Encoder } from '../../../src/use-cases/signup/ports/encoder'

export class FakeEncoder implements Encoder {
  public encode (plain: string): string {
    return plain + 'ENCRYPTED'
  }
}
