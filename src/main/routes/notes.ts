import { Router } from 'express'
import { makeCreateNoteController, makeRemoveNoteController, makeUpdateNoteController, makeLoadNotesController } from '@/main/factories'
import { adaptRoute } from '../adapters/express-route-adapter'
import { authentication } from '@/main/middleware/'

export default (router: Router): void => {
  router.post('/notes', authentication, adaptRoute(makeCreateNoteController()))
  router.delete('/notes/:noteId', authentication, adaptRoute(makeRemoveNoteController()))
  router.put('/notes/:noteId', authentication, adaptRoute(makeUpdateNoteController()))
  router.get('/notes', authentication, adaptRoute(makeLoadNotesController()))
}
