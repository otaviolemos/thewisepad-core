import { HttpRequest, HttpResponse, WebController } from '@/presentation/controllers/ports'
import { UseCase } from '@/use-cases/ports'
import { badRequest, getMissingParams } from '@/presentation/controllers/util'
import { MissingParamError } from '@/presentation/controllers/errors'

export class LoadNotesController implements WebController {
  private readonly loadNotesUseCase: UseCase
  constructor (loadNotesUseCase: UseCase) {
    this.loadNotesUseCase = loadNotesUseCase
  }

  async handle (request: HttpRequest): Promise<HttpResponse> {
    try {
      const requiredParam = ['userId']
      const missingParams: string = getMissingParams(request, requiredParam)
      if (missingParams) {
        return badRequest(new MissingParamError(missingParams))
      }
      return {
        statusCode: 200,
        body: await this.loadNotesUseCase.perform(request.body.userId)
      }
    } catch (error) {
      return {
        statusCode: 500,
        body: error
      }
    }
  }
}
