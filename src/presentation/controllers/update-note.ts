import { InvalidTitleError } from '@/entities/errors'
import { HttpRequest, HttpResponse, WebController } from '@/presentation/controllers/ports'
import { Either } from '@/shared'
import { ExistingTitleError } from '@/use-cases/create-note/errors'
import { NoteData, UseCase } from '@/use-cases/ports'
import { badRequest, getMissingParams, ok } from '@/presentation/controllers/util'
import { MissingParamError } from '@/presentation/controllers/errors'

export class UpdateNoteController implements WebController {
  private readonly updateNoteUseCase: UseCase
  constructor (updateNoteUseCase: UseCase) {
    this.updateNoteUseCase = updateNoteUseCase
  }

  async handle (request: HttpRequest): Promise<HttpResponse> {
    const requiredUpdateParams = ['title', 'content']
    const missingUpdateParams: string = getMissingParams(request, requiredUpdateParams)
    if (missingUpdateParams.split(',').length === 2) {
      return badRequest(new MissingParamError(missingUpdateParams))
    }
    const useCaseResponse: Either<ExistingTitleError | InvalidTitleError, NoteData> =
     await this.updateNoteUseCase.perform(request.body)

    if (useCaseResponse.isRight()) {
      return ok(useCaseResponse.value)
    }

    if (useCaseResponse.isLeft()) {
      return badRequest(useCaseResponse.value)
    }
  }
}
