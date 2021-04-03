import { HttpRequest } from './http-request'
import { HttpResponse } from './http-response'

export interface ControllerOperation {
  readonly requiredParams: string[]
  specificOp (request: HttpRequest): Promise<HttpResponse>
}
