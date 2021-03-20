import { CreateNote } from '@/use-cases/create-note'
import { CreateNoteController } from '@/presentation/controllers'
import { makeUserRepository, makeNoteRepository } from '@/main/factories'

export const makeCreateNoteController = (): CreateNoteController => {
  const userRepository = makeUserRepository()
  const noteRepository = makeNoteRepository()
  const usecase = new CreateNote(noteRepository, userRepository)
  const controller = new CreateNoteController(usecase)
  return controller
}
