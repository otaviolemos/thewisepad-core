import { adaptMiddleware } from '@/main/adapters'
import { makeAuthMiddleware } from '@/main/factories'

export const authentication = adaptMiddleware(makeAuthMiddleware())
