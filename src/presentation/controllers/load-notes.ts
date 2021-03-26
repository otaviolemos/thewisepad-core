import { HttpRequest, HttpResponse, WebController } from '@/presentation/controllers/ports'
import { ok } from '@/presentation/controllers/util'
import { UseCase } from '@/use-cases/ports'

export class LoadNotesController extends WebController {
  constructor (useCase: UseCase) {
    super(useCase)
    super.requiredParams = ['userId']
  }

  async specificOp (request: HttpRequest): Promise<HttpResponse> {
    return ok(await this.useCase.perform(request.body.userId))
  }
}
