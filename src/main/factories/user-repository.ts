import { UserRepository } from '@/use-cases/ports'
import { MongodbUserRepository } from '@/external/repositories/mongodb/mondodb-user-repository'

export const makeUserRepository = (): UserRepository => {
  return new MongodbUserRepository()
}
