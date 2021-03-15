import { Router } from 'express'
import { makeSignInController } from '@/main/factories/sign-in-controller'
import { adaptRoute } from '../adapters/express-route-adapter'

export default (router: Router): void => {
  router.post('/signin', adaptRoute(makeSignInController()))
}
