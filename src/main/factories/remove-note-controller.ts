import { RemoveNote } from '@/use-cases/remove-note'
import { RemoveNoteController } from '@/presentation/controllers'
import { makeNoteRepository } from '@/main/factories'

export const makeRemoveNoteController = (): RemoveNoteController => {
  const noteRepository = makeNoteRepository()
  const usecase = new RemoveNote(noteRepository)
  const controller = new RemoveNoteController(usecase)
  return controller
}
