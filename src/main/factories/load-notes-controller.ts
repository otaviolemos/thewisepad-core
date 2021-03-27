import { LoadNotes } from '@/use-cases/load-notes'
import { LoadNotesController, WebController } from '@/presentation/controllers'
import { makeNoteRepository } from '@/main/factories'

export const makeLoadNotesController = (): WebController => {
  const noteRepository = makeNoteRepository()
  const usecase = new LoadNotes(noteRepository)
  const controller = new WebController(new LoadNotesController(usecase))
  return controller
}
