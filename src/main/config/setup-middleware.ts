import { Express } from 'express'
import { bodyParser } from '@/main/middleware'

export default (app: Express): void => {
  app.use(bodyParser)
}
