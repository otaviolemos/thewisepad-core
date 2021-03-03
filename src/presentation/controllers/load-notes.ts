import { HttpRequest, HttpResponse, WebController } from '@/presentation/controllers/ports'
import { UseCase } from '@/use-cases/ports'

export class LoadNotesController implements WebController {
  private readonly loadNotesUseCase: UseCase
  constructor (loadNotesUseCase: UseCase) {
    this.loadNotesUseCase = loadNotesUseCase
  }

  async handle (request: HttpRequest): Promise<HttpResponse> {
    try {
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
