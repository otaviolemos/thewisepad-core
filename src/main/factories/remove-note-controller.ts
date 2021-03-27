import { RemoveNote } from '@/use-cases/remove-note'
import { RemoveNoteController, WebController } from '@/presentation/controllers'
import { makeNoteRepository } from '@/main/factories'

export const makeRemoveNoteController = (): WebController => {
  const noteRepository = makeNoteRepository()
  const usecase = new RemoveNote(noteRepository)
  const controller = new WebController(new RemoveNoteController(usecase))
  return controller
}
