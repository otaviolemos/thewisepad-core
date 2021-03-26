import { HttpRequest, HttpResponse, WebController } from '@/presentation/controllers/ports'
import { Either } from '@/shared'
import { NoteData, UseCase } from '@/use-cases/ports'
import { UnexistingNoteError } from '@/use-cases/remove-note/errors'
import { badRequest, getMissingParams, ok, serverError } from '@/presentation/controllers/util'
import { MissingParamError } from '@/presentation/controllers/errors'

export class RemoveNoteController extends WebController {
  constructor (useCase: UseCase) {
    super(useCase)
    super.requiredParams = ['noteId']
  }

  async handle (request: HttpRequest): Promise<HttpResponse> {
    try {
      const missingParams: string = getMissingParams(request, this.requiredParams)
      if (missingParams) {
        return badRequest(new MissingParamError(missingParams))
      }
      const useCaseResponse: Either<UnexistingNoteError, NoteData> =
        await this.useCase.perform(request.body.noteId)

      if (useCaseResponse.isRight()) {
        return ok(useCaseResponse.value)
      }

      return badRequest(useCaseResponse.value)
    } catch (error) {
      return serverError(error)
    }
  }
}
