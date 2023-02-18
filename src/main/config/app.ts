import express from 'express'
import setupMiddleware from '@/main/config/setup-middleware'
import setupRoutes from '@/main/config/setup-routes'
import setupDocGeneration from '@/main/config/setup-doc-generation'

const app = express()
setupMiddleware(app)
setupRoutes(app)
if (process.env.GENERATE_DOC) {
  setupDocGeneration(app)
}

export default app
