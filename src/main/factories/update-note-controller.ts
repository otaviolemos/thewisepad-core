import { UpdateNote } from '@/use-cases/update-note'
import { UpdateNoteOperation, WebController } from '@/presentation/controllers'
import { makeUserRepository, makeNoteRepository } from '@/main/factories'

export const makeUpdateNoteController = (): WebController => {
  const userRepository = makeUserRepository()
  const noteRepository = makeNoteRepository()
  const usecase = new UpdateNote(noteRepository, userRepository)
  const controller = new WebController(new UpdateNoteOperation(usecase))
  return controller
}
