import { NoteData } from './note-data'

export interface NoteRepository {
  add (noteData: NoteData): Promise<NoteData>
  findAllNotesFrom (userId: string): Promise<NoteData[]>
  findById (noteId: string): Promise<NoteData>
  remove (noteId: string): Promise<void>
  updateTitle (noteId: string, newTitle: string): Promise<void>
  updateContent (noteId: string, newContent: string): Promise<void>
}
