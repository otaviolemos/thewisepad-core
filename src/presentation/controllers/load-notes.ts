import { HttpRequest, HttpResponse, WebController } from '@/presentation/controllers/ports'
import { badRequest, getMissingParams, ok, serverError } from '@/presentation/controllers/util'
import { MissingParamError } from '@/presentation/controllers/errors'
import { UseCase } from '@/use-cases/ports'

export class LoadNotesController extends WebController {
  constructor (useCase: UseCase) {
    super(useCase)
    super.requiredParams = ['userId']
  }

  async handle (request: HttpRequest): Promise<HttpResponse> {
    try {
      const missingParams: string = getMissingParams(request, this.requiredParams)
      if (missingParams) {
        return badRequest(new MissingParamError(missingParams))
      }
      return ok(await this.useCase.perform(request.body.userId))
    } catch (error) {
      return serverError(error)
    }
  }
}
