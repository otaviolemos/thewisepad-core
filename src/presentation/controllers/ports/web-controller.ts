import { HttpResponse, HttpRequest } from '@/presentation/controllers/ports'
import { UseCase } from '@/use-cases/ports'
import { badRequest, serverError } from '@/presentation/controllers/util'
import { MissingParamError } from '@/presentation/controllers/errors'

export abstract class WebController {
  protected requiredParams: string[]
  protected readonly useCase: UseCase

  constructor (usecase: UseCase) {
    this.useCase = usecase
  }

  public async handle (request: HttpRequest): Promise<HttpResponse> {
    try {
      const missingParams: string = this.getMissingParams(request)
      if (missingParams) {
        return badRequest(new MissingParamError(missingParams))
      }
      return await this.specificOp(request)
    } catch (error) {
      return serverError(error)
    }
  }

  protected abstract specificOp (request: HttpRequest): Promise<HttpResponse>

  private getMissingParams (request: HttpRequest): string {
    const missingParams: string[] = []
    this.requiredParams.forEach(function (name) {
      if (!Object.keys(request.body).includes(name)) {
        missingParams.push(name)
      }
    })
    return missingParams.join(', ')
  }
}
