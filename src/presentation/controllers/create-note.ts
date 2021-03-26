import { InvalidTitleError } from '@/entities/errors'
import { HttpRequest, HttpResponse, WebController } from '@/presentation/controllers/ports'
import { Either } from '@/shared'
import { ExistingTitleError, UnregisteredOwnerError } from '@/use-cases/create-note/errors'
import { NoteData } from '@/use-cases/ports'
import { created, badRequest, getMissingParams, serverError } from '@/presentation/controllers/util'
import { MissingParamError } from '@/presentation/controllers/errors'

export class CreateNoteController extends WebController {
  async handle (request: HttpRequest): Promise<HttpResponse> {
    try {
      const requiredParams = ['title', 'content', 'ownerEmail']
      const missingParams: string = getMissingParams(request, requiredParams)
      if (missingParams) {
        return badRequest(new MissingParamError(missingParams))
      }
      const noteRequest: NoteData = {
        title: request.body.title,
        content: request.body.content,
        ownerEmail: request.body.ownerEmail
      }
      const useCaseResponse: Either<ExistingTitleError | UnregisteredOwnerError | InvalidTitleError, NoteData> =
        await this.useCase.perform(noteRequest)

      if (useCaseResponse.isRight()) {
        return created(useCaseResponse.value)
      }

      return badRequest(useCaseResponse.value)
    } catch (error) {
      return serverError(error)
    }
  }
}
