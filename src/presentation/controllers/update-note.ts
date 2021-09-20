import { InvalidTitleError } from '@/entities/errors'
import { HttpRequest, HttpResponse, ControllerOperation } from '@/presentation/controllers/ports'
import { Either } from '@/shared'
import { ExistingTitleError } from '@/use-cases/create-note/errors'
import { NoteData, UseCase } from '@/use-cases/ports'
import { badRequest, ok } from '@/presentation/controllers/util'
import { MissingParamError } from '@/presentation/controllers/errors'
import { WebController } from './web-controller'

export class UpdateNoteOperation implements ControllerOperation {
  readonly requiredParams = ['id', 'ownerEmail', 'ownerId']
  private useCase: UseCase

  constructor (useCase: UseCase) {
    this.useCase = useCase
  }

  async specificOp (request: HttpRequest): Promise<HttpResponse> {
    const updateParams = ['title', 'content']
    const missingUpdateParams: string = WebController.getMissingParams(request, updateParams)
    if (missingTitleAndContent(missingUpdateParams)) {
      return badRequest(new MissingParamError(missingUpdateParams))
    }

    const useCaseResponse:
      Either<ExistingTitleError | InvalidTitleError, NoteData> =
        await this.useCase.perform(request.body)

    if (useCaseResponse.isRight()) {
      return ok(useCaseResponse.value)
    }

    return badRequest(useCaseResponse.value)
  }
}

function missingTitleAndContent (missingUpdateParams: string): boolean {
  return missingUpdateParams.split(',').length === 2
}
