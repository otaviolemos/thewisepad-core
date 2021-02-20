import { HttpRequest } from '@/presentation/controllers/ports'

export const getMissingParams = (request: HttpRequest, requiredFields: string[]): string[] => {
  const missingParams: string[] = []

  requiredFields.forEach(function (name) {
    if (!Object.keys(request.body).includes(name)) {
      missingParams.push(name)
    }
  })

  return missingParams
}
