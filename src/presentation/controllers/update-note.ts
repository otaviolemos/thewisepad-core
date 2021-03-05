import { InvalidTitleError } from '@/entities/errors'
import { HttpRequest, HttpResponse, WebController } from '@/presentation/controllers/ports'
import { Either } from '@/shared'
import { ExistingTitleError } from '@/use-cases/create-note/errors'
import { NoteData, UseCase } from '@/use-cases/ports'

export class UpdateNoteController implements WebController {
  private readonly updateNoteUseCase: UseCase
  constructor (updateNoteUseCase: UseCase) {
    this.updateNoteUseCase = updateNoteUseCase
  }

  async handle (request: HttpRequest): Promise<HttpResponse> {
    const useCaseResponse: Either<ExistingTitleError | InvalidTitleError, NoteData> =
     await this.updateNoteUseCase.perform(request.body)
    const response: HttpResponse = {
      statusCode: 200,
      body: useCaseResponse.value
    }

    if (useCaseResponse.isLeft()) {
      response.statusCode = 400
    }

    return response
  }
}
