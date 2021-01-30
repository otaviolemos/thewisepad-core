import express from 'express'
import setupMiddleware from '@/main/config/setup-middleware'
import setupRoutes from '@/main/config/setup-routes'

const app = express()
setupMiddleware(app)
setupRoutes(app)

export default app
