import { MongoHelper } from '@/external/repositories/mongodb/helpers'
import { MongodbUserRepository } from '@/external/repositories/mongodb/mondodb-user-repository'
import { UserData } from '@/use-cases/ports'
import { UserBuilder } from '@test/builders'

describe('Mongodb User repository', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL)
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    await MongoHelper.clearCollection('users')
  })

  test('should add a valid user', async () => {
    const repository = new MongodbUserRepository()
    const aValidUser = UserBuilder.aUser().build()
    await repository.add(aValidUser)
    const user = await repository.findByEmail(aValidUser.email) as UserData
    expect(user.id).toBeDefined()
    expect(user.id).not.toEqual(aValidUser.id)
  })

  test('should add two users and find all', async () => {
    const repository = new MongodbUserRepository()
    const aUser = UserBuilder.aUser().build()
    const aSecondUser = UserBuilder.aUser().withDifferentEmail().build()
    await repository.add(aUser)
    await repository.add(aSecondUser)
    const users = await repository.findAll() as UserData[]
    expect(users.length).toEqual(2)
    expect(users[0]).toHaveProperty('id')
  })

  test('should not find unexisting user', async () => {
    const repository = new MongodbUserRepository()
    expect(await repository.findByEmail('any@mail.com')).toBeNull()
  })
})
