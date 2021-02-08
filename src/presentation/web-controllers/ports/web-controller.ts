import { HttpResponse, HttpRequest } from '@/presentation/web-controllers/ports'

export interface WebController {
 handle (request: HttpRequest): Promise<HttpResponse>
}
