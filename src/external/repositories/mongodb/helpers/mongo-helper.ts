import { MongoClient, Collection } from 'mongodb'

export const MongoHelper = {
  client: null as MongoClient,
  async connect (uri: string): Promise<void> {
    this.client = await MongoClient.connect(uri)
  },
  async disconnect (): Promise<void> {
    await this.client.close()
  },
  async getCollection (name: string): Promise<Collection> {
    return await this.client.db().collection(name)
  },
  async clearCollection (name: string): Promise<void> {
    await this.client.db().collection(name).deleteMany({})
  }
}
