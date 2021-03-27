import { CreateNote } from '@/use-cases/create-note'
import { CreateNoteOperation, WebController } from '@/presentation/controllers'
import { makeUserRepository, makeNoteRepository } from '@/main/factories'

export const makeCreateNoteController = (): WebController => {
  const userRepository = makeUserRepository()
  const noteRepository = makeNoteRepository()
  const usecase = new CreateNote(noteRepository, userRepository)
  const controller = new WebController(new CreateNoteOperation(usecase))
  return controller
}
