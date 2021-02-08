import { HttpResponse, HttpRequest } from '@/presentation/controllers/ports'

export interface WebController {
 handle (request: HttpRequest): Promise<HttpResponse>
}
