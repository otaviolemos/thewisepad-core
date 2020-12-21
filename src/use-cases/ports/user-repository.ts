import { UserData } from '../../entities/user-data'

export interface UserRepository {
  findAllUsers () : Promise<UserData[]>
  findUserByEmail (email: string) : Promise<UserData>
  addUser (userData: UserData): Promise<UserData>
}
