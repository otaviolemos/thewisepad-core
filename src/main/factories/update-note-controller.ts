import { UpdateNote } from '@/use-cases/update-note'
import { UpdateNoteController } from '@/presentation/controllers'
import { makeUserRepository, makeNoteRepository } from '@/main/factories'

export const makeUpdateNoteController = (): UpdateNoteController => {
  const userRepository = makeUserRepository()
  const noteRepository = makeNoteRepository()
  const usecase = new UpdateNote(noteRepository, userRepository)
  const controller = new UpdateNoteController(usecase)
  return controller
}
