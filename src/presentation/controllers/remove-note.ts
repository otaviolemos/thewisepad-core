import { HttpRequest, HttpResponse, WebController } from '@/presentation/controllers/ports'
import { Either } from '@/shared'
import { NoteData, UseCase } from '@/use-cases/ports'
import { UnexistingNoteError } from '@/use-cases/remove-note/errors'
import { badRequest, getMissingParams, ok } from '@/presentation/controllers/util'
import { MissingParamError } from '@/presentation/controllers/errors'

export class RemoveNoteController implements WebController {
  private readonly removeNoteUseCase: UseCase

  constructor (removeNoteUseCase: UseCase) {
    this.removeNoteUseCase = removeNoteUseCase
  }

  async handle (request: HttpRequest): Promise<HttpResponse> {
    const requiredParams = ['noteId']
    const missingParams: string = getMissingParams(request, requiredParams)
    if (missingParams) {
      return badRequest(new MissingParamError(missingParams))
    }
    const useCaseResponse: Either<UnexistingNoteError, NoteData> =
      await this.removeNoteUseCase.perform(request.body.noteId)

    if (useCaseResponse.isRight()) {
      return ok(useCaseResponse.value)
    }

    return badRequest(useCaseResponse.value)
  }
}
