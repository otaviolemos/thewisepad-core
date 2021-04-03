import { InvalidTitleError } from '@/entities/errors'
import { HttpRequest, HttpResponse, ControllerOperation } from '@/presentation/controllers/ports'
import { Either } from '@/shared'
import { ExistingTitleError, UnregisteredOwnerError } from '@/use-cases/create-note/errors'
import { NoteData, UseCase } from '@/use-cases/ports'
import { created, badRequest } from '@/presentation/controllers/util'

export class CreateNoteOperation implements ControllerOperation {
  private useCase: UseCase
  readonly requiredParams = ['title', 'content', 'ownerEmail']

  constructor (useCase: UseCase) {
    this.useCase = useCase
  }

  async specificOp (request: HttpRequest): Promise<HttpResponse> {
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
  }
}
