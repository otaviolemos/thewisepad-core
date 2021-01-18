import { HttpResponse } from '@/web-controllers/ports'

export interface WebController {
  handle (request: any): Promise<HttpResponse>
}
