import { NoteData, NoteRepository } from '@/use-cases/ports'
import { MongoHelper } from '@/external/repositories/mongodb/helpers'

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

  findAllNotesFrom (userId: string): Promise<NoteData[]> {
    throw new Error('Method not implemented.')
  }

  async findById (noteId: string): Promise<NoteData> {
    const noteCollection = await MongoHelper.getCollection('notes')
    const dbNote: MongodbNote = await noteCollection.findOne({ _id: noteId })
    return this.withApplicationId(dbNote)
  }

  remove (noteId: string): Promise<NoteData> {
    throw new Error('Method not implemented.')
  }

  updateTitle (noteId: string, newTitle: string): Promise<boolean> {
    throw new Error('Method not implemented.')
  }

  updateContent (noteId: string, newContent: string): Promise<boolean> {
    throw new Error('Method not implemented.')
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
