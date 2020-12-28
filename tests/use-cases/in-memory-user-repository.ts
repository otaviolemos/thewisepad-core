import { UserRepository } from '../../src/use-cases/ports/user-repository'
import { UserData } from '../../src/entities/user-data'
import { v4 as uuidv4 } from 'uuid'

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
    const found = this.data.find((user: UserData, index: number) => user.email === email)
    return found || null
  }

  public async addUser (userData: UserData): Promise<UserData> {
    userData.id = uuidv4()
    this._data.push(userData)
    return userData
  }
}
