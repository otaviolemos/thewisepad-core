import { UserData, UserRepository } from '@/use-cases/ports'
import { MongoHelper } from './helpers'

export class MongodbUserRepository implements UserRepository {
  findAll (): Promise<UserData[]> {
    throw new Error('Method not implemented.')
  }

  async findByEmail (email: string): Promise<UserData> {
    const userCollection = await MongoHelper.getCollection('users')
    const user = await userCollection.findOne({ email: email })
    return {
      email: user.email,
      password: user.password,
      id: user._id
    }
  }

  async add (user: UserData): Promise<UserData> {
    const userCollection = await MongoHelper.getCollection('users')
    const userClone = {
      email: user.email,
      password: user.password,
      _id: null
    }
    await userCollection.insertOne(userClone)
    return {
      email: userClone.email,
      password: userClone.password,
      id: userClone._id
    }
  }
}
