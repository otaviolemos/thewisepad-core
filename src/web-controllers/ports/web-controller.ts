import { UseCase } from '@/use-cases/ports'
import { HttpResponse, HttpRequest } from '@/web-controllers/ports'

export abstract class WebController {
  protected readonly usecase: UseCase

  constructor (usecase: UseCase) {
    this.usecase = usecase
  }

  abstract handle (request: HttpRequest): Promise<HttpResponse>
}
