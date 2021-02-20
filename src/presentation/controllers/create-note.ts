import { InvalidTitleError } from '@/entities/errors'
import { HttpRequest, HttpResponse, WebController } from '@/presentation/controllers/ports'
import { Either } from '@/shared'
import { ExistingTitleError, UnregisteredOwnerError } from '@/use-cases/create-note/errors'
import { NoteData, UseCase } from '@/use-cases/ports'
import { created } from '@/presentation/controllers/util/http-helper'

export class CreateNoteController implements WebController {
  private readonly useCase: UseCase

  constructor (createNoteUseCase: UseCase) {
    this.useCase = createNoteUseCase
  }

  async handle (request: HttpRequest): Promise<HttpResponse> {
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
  }
}
