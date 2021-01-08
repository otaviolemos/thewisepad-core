import { UserData } from './user-data'

export interface UserRepository {
  findAll () : Promise<UserData[]>
  findByEmail (email: string) : Promise<UserData>
  add (userData: UserData): Promise<UserData>
}
