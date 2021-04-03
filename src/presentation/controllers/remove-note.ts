import { HttpRequest, HttpResponse, ControllerOperation } from '@/presentation/controllers/ports'
import { Either } from '@/shared'
import { UseCase } from '@/use-cases/ports'
import { UnexistingNoteError } from '@/use-cases/remove-note/errors'
import { badRequest, ok } from '@/presentation/controllers/util'

export class RemoveNoteOperation implements ControllerOperation {
  readonly requiredParams = ['noteId']
  private readonly useCase: UseCase

  constructor (useCase: UseCase) {
    this.useCase = useCase
  }

  async specificOp (request: HttpRequest): Promise<HttpResponse> {
    const useCaseResponse: Either<UnexistingNoteError, void> =
      await this.useCase.perform(request.body.noteId)

    if (useCaseResponse.isRight()) {
      return ok(useCaseResponse.value)
    }

    return badRequest(useCaseResponse.value)
  }
}
