import { HttpRequest, HttpResponse, WebController } from '@/presentation/controllers/ports'
import { Either } from '@/shared'
import { NoteData, UseCase } from '@/use-cases/ports'
import { UnexistingNoteError } from '@/use-cases/remove-note/errors'
import { badRequest, ok } from '@/presentation/controllers/util'

export class RemoveNoteController extends WebController {
  constructor (useCase: UseCase) {
    super(useCase)
    super.requiredParams = ['noteId']
  }

  async specificOp (request: HttpRequest): Promise<HttpResponse> {
    const useCaseResponse: Either<UnexistingNoteError, NoteData> =
      await this.useCase.perform(request.body.noteId)

    if (useCaseResponse.isRight()) {
      return ok(useCaseResponse.value)
    }

    return badRequest(useCaseResponse.value)
  }
}
