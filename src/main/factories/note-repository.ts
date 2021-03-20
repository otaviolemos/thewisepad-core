import { NoteRepository } from '@/use-cases/ports'
import { MongodbNoteRepository } from '@/external/repositories/mongodb'

export const makeNoteRepository = (): NoteRepository => {
  return new MongodbNoteRepository()
}
