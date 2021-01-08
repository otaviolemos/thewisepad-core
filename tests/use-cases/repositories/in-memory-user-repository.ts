import { UserRepository } from '../../../src/use-cases/ports/user-repository'
import { UserData } from '../../../src/entities/ports/user-data'

export class InMemoryUserRepository implements UserRepository {
  private readonly _data: UserData[]
  private idcounter: number = 0

  public get data () {
    return this._data
  }

  constructor (data: UserData[]) {
    this._data = data
  }

  public async findAll (): Promise<UserData[]> {
    return this._data
  }

  public async findByEmail (email: string): Promise<UserData> {
    const found = this.data.find((user: UserData, index: number) => user.email === email)
    return found || null
  }

  public async add (userData: UserData): Promise<UserData> {
    userData.id = this.idcounter.toString()
    this.idcounter++
    this._data.push(userData)
    return userData
  }
}
