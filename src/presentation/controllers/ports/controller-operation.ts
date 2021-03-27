import { HttpRequest } from './http-request'
import { HttpResponse } from './http-response'

export interface ControllerOperation {
  requiredParams: string[]
  specificOp (request: HttpRequest): Promise<HttpResponse>
}
