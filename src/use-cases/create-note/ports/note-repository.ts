import { NoteData } from '../note-data'

export interface NoteRepository {
  addNote (noteData: NoteData): Promise<NoteData>
  findAllNotesFrom (userId: string): Promise<NoteData[]>
  findNote (noteId: string): Promise<NoteData>
  remove (noteId: string): Promise<NoteData>
}
