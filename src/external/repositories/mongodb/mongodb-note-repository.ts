import { NoteData, NoteRepository } from '@/use-cases/ports'
import { MongoHelper } from '@/external/repositories/mongodb/helpers'
import { ObjectId } from 'mongodb'

export type MongodbNote = {
  title: string,
  content: string,
  ownerEmail: string,
  ownerId: ObjectId,
  _id: ObjectId
}

export class MongodbNoteRepository implements NoteRepository {
  async add (note: NoteData): Promise<NoteData> {
    const noteCollection = await MongoHelper.getCollection('notes')
    const noteClone: MongodbNote = {
      title: note.title,
      content: note.content,
      ownerEmail: note.ownerEmail,
      ownerId: new ObjectId(note.ownerId),
      _id: null
    }
    await noteCollection.insertOne(noteClone)
    return this.withApplicationId(noteClone)
  }

  async findAllNotesFrom (userId: string): Promise<NoteData[]> {
    const noteCollection = await MongoHelper.getCollection('notes')
    const notesFromUser: MongodbNote[] =
      await noteCollection.find<MongodbNote>({ ownerId: new ObjectId(userId) }).toArray()
    return notesFromUser.map(this.withApplicationId)
  }

  async findById (noteId: string): Promise<NoteData> {
    const noteCollection = await MongoHelper.getCollection('notes')
    const dbNote: MongodbNote = await noteCollection.findOne<MongodbNote>({ _id: new ObjectId(noteId) })
    if (dbNote) {
      return this.withApplicationId(dbNote)
    }
    return null
  }

  async remove (noteId: string): Promise<void> {
    const noteCollection = await MongoHelper.getCollection('notes')
    await noteCollection.deleteOne({ _id: new ObjectId(noteId) })
  }

  async updateTitle (noteId: string, newTitle: string): Promise<void> {
    const noteCollection = await MongoHelper.getCollection('notes')
    await noteCollection.updateOne({ _id: new ObjectId(noteId) }, {
      $set: {
        title: newTitle
      }
    })
  }

  async updateContent (noteId: string, newContent: string): Promise<void> {
    const noteCollection = await MongoHelper.getCollection('notes')
    await noteCollection.updateOne({ _id: new ObjectId(noteId) }, {
      $set: {
        content: newContent
      }
    })
  }

  private withApplicationId (dbNote: MongodbNote): NoteData {
    return {
      title: dbNote.title,
      content: dbNote.content,
      ownerEmail: dbNote.ownerEmail,
      ownerId: dbNote.ownerId.toString(),
      id: dbNote._id.toString()
    }
  }
}
