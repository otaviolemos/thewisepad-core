export interface Encoder {
  encode (plain: string): Promise<string>
}
