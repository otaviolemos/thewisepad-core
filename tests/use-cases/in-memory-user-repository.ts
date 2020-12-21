import { UserRepository } from '../../src/use-cases/ports/user-repository'
import { UserData } from '../../src/entities/user-data'

export class InMemoryUserRepository implements UserRepository {
  private readonly _data: UserData[]

  public get data () {
    return this._data
  }

  constructor (data: UserData[]) {
    this._data = data
  }

  public async findAllUsers (): Promise<UserData[]> {
    return this._data
  }

  public async findUserByEmail (email: string): Promise<UserData> {
    const found = this.data.find(user => user.email === email)
    return found || null
  }

  public async addUser (userData: UserData): Promise<UserData> {
    this._data.push(userData)
    return userData
  }
}
