import { HttpResponse } from '@/web-controllers/ports'

export interface Middleware<T = any> {
  handle: (httpRequest: T) => Promise<HttpResponse>
}
