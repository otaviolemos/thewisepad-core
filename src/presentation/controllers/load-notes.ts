import { HttpRequest, HttpResponse, WebController } from '@/presentation/controllers/ports'
import { badRequest, getMissingParams, ok, serverError } from '@/presentation/controllers/util'
import { MissingParamError } from '@/presentation/controllers/errors'

export class LoadNotesController extends WebController {
  async handle (request: HttpRequest): Promise<HttpResponse> {
    try {
      const requiredParam = ['userId']
      const missingParams: string = getMissingParams(request, requiredParam)
      if (missingParams) {
        return badRequest(new MissingParamError(missingParams))
      }
      return ok(await this.useCase.perform(request.body.userId))
    } catch (error) {
      return serverError(error)
    }
  }
}
