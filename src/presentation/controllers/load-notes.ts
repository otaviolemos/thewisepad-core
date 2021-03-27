import { HttpRequest, HttpResponse, ControllerOperation } from '@/presentation/controllers/ports'
import { ok } from '@/presentation/controllers/util'
import { UseCase } from '@/use-cases/ports'

export class LoadNotesController implements ControllerOperation {
  requiredParams = ['userId']
  private readonly useCase: UseCase

  constructor (useCase: UseCase) {
    this.useCase = useCase
  }

  async specificOp (request: HttpRequest): Promise<HttpResponse> {
    return ok(await this.useCase.perform(request.body.userId))
  }
}
