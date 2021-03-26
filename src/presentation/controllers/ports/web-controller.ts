import { HttpResponse, HttpRequest } from '@/presentation/controllers/ports'
import { UseCase } from '@/use-cases/ports'

export abstract class WebController {
  protected readonly useCase: UseCase

  constructor (usecase: UseCase) {
    this.useCase = usecase
  }

  public abstract handle (request: HttpRequest): Promise<HttpResponse>
}
