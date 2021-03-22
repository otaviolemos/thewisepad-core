import { LoadNotes } from '@/use-cases/load-notes'
import { LoadNotesController } from '@/presentation/controllers'
import { makeNoteRepository } from '@/main/factories'

export const makeLoadNotesController = (): LoadNotesController => {
  const noteRepository = makeNoteRepository()
  const usecase = new LoadNotes(noteRepository)
  const controller = new LoadNotesController(usecase)
  return controller
}
