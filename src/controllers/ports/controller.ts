import { HttpResponse } from '@/controllers/ports'

export interface Controller {
  handle (request: any): Promise<HttpResponse>
}
