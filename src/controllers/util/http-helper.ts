import { HttpResponse } from '@/controllers/ports'

export const ok = (data: any): HttpResponse => ({
  statusCode: 200,
  body: data
})
