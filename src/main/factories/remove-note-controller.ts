import { RemoveNote } from '@/use-cases/remove-note'
import { RemoveNoteOperation, WebController } from '@/presentation/controllers'
import { makeNoteRepository } from '@/main/factories'

export const makeRemoveNoteController = (): WebController => {
  const noteRepository = makeNoteRepository()
  const usecase = new RemoveNote(noteRepository)
  const controller = new WebController(new RemoveNoteOperation(usecase))
  return controller
}
