import { UpdateNote } from '@/use-cases/update-note'
import { UpdateNoteController, WebController } from '@/presentation/controllers'
import { makeUserRepository, makeNoteRepository } from '@/main/factories'

export const makeUpdateNoteController = (): WebController => {
  const userRepository = makeUserRepository()
  const noteRepository = makeNoteRepository()
  const usecase = new UpdateNote(noteRepository, userRepository)
  const controller = new WebController(new UpdateNoteController(usecase))
  return controller
}
