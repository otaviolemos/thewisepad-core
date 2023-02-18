import { Express, Router } from 'express'
import { authentication } from '@/main/middleware'
import { adaptRoute } from '@/main/adapters'
import { makeCreateNoteController, makeLoadNotesController, makeRemoveNoteController, makeSignUpController, makeUpdateNoteController, makeSignInController } from '@/main/factories'

export default (app: Express): void => {
  const router = Router()
  app.use('/api', router)
  router.post('/notes', authentication, adaptRoute(makeCreateNoteController()))
  router.delete('/notes/:noteId', authentication, adaptRoute(makeRemoveNoteController()))
  router.put('/notes/:noteId', authentication, adaptRoute(makeUpdateNoteController()))
  router.get('/notes', authentication, adaptRoute(makeLoadNotesController()))
  router.post('/signin', adaptRoute(makeSignInController()))
  router.post('/signup', adaptRoute(makeSignUpController()))
}
