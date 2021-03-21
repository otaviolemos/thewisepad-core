import { NoteData, NoteRepository } from '@/use-cases/ports'
import { MongoHelper } from '@/external/repositories/mongodb/helpers'
import { ObjectId } from 'mongodb'

export type MongodbNote = {
  title: string,
  content: string,
  ownerEmail: string,
  ownerId: string,
  _id: string
}

export class MongodbNoteRepository implements NoteRepository {
  async add (note: NoteData): Promise<NoteData> {
    const noteCollection = await MongoHelper.getCollection('notes')
    const noteClone: MongodbNote = {
      title: note.title,
      content: note.content,
      ownerEmail: note.ownerEmail,
      ownerId: note.ownerId,
      _id: null
    }
    await noteCollection.insertOne(noteClone)
    return this.withApplicationId(noteClone)
  }

  async findAllNotesFrom (userId: string): Promise<NoteData[]> {
    const noteCollection = await MongoHelper.getCollection('notes')
    const notesFromUser: MongodbNote[] = await noteCollection.find({ ownerId: userId }).toArray()
    return notesFromUser.map(this.withApplicationId)
  }

  async findById (noteId: string): Promise<NoteData> {
    const noteCollection = await MongoHelper.getCollection('notes')
    const dbNote: MongodbNote = await noteCollection.findOne({ _id: new ObjectId(noteId) })
    if (dbNote) {
      return this.withApplicationId(dbNote)
    }
    return null
  }

  async remove (noteId: string): Promise<NoteData> {
    const noteCollection = await MongoHelper.getCollection('notes')
    const noteToBeRemoved = await noteCollection.findOne({ _id: new ObjectId(noteId) })
    const result = await noteCollection.deleteOne({ _id: new ObjectId(noteId) })
    if (result.deletedCount === 1) {
      return this.withApplicationId(noteToBeRemoved)
    }
    return null
  }

  async updateTitle (noteId: string, newTitle: string): Promise<boolean> {
    const noteCollection = await MongoHelper.getCollection('notes')
    const result = await noteCollection.updateOne({ _id: new ObjectId(noteId) }, {
      $set: {
        title: newTitle
      }
    })
    if (result.modifiedCount === 1) {
      return true
    }
    return false
  }

  async updateContent (noteId: string, newContent: string): Promise<boolean> {
    const noteCollection = await MongoHelper.getCollection('notes')
    const result = await noteCollection.updateOne({ _id: new ObjectId(noteId) }, {
      $set: {
        content: newContent
      }
    })
    if (result.modifiedCount === 1) {
      return true
    }
    return false
  }

  private withApplicationId (dbNote: MongodbNote): NoteData {
    return {
      title: dbNote.title,
      content: dbNote.content,
      ownerEmail: dbNote.ownerEmail,
      ownerId: dbNote.ownerId,
      id: dbNote._id
    }
  }
}
