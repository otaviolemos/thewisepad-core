import { UserData, UserRepository } from '@/use-cases/ports'
import { MongoHelper } from './helpers'

export type MongodbUser = {
  email: string,
  password: string,
  _id: string
}

export class MongodbUserRepository implements UserRepository {
  findAll (): Promise<UserData[]> {
    throw new Error('Method not implemented.')
  }

  async findByEmail (email: string): Promise<UserData> {
    const userCollection = await MongoHelper.getCollection('users')
    const user = await userCollection.findOne({ email: email })
    return this.withApplicationId(user)
  }

  async add (user: UserData): Promise<UserData> {
    const userCollection = await MongoHelper.getCollection('users')
    const userClone = {
      email: user.email,
      password: user.password,
      _id: null
    }
    await userCollection.insertOne(userClone)
    return this.withApplicationId(userClone)
  }

  private withApplicationId (dbUser: MongodbUser): UserData {
    return {
      email: dbUser.email,
      password: dbUser.password,
      id: dbUser._id
    }
  }
}
