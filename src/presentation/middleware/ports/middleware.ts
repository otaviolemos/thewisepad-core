import { HttpResponse } from '@/presentation/controllers/ports'

export interface Middleware<T = any> {
  handle: (httpRequest: T) => Promise<HttpResponse>
}
