import { HttpResponse, HttpRequest } from '@/web-controllers/ports'

export interface WebController {
  handle (request: HttpRequest): Promise<HttpResponse>
}
