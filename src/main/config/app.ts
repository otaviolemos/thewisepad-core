import express from 'express'
import setupMiddleware from '@/main/config/setup-middleware'

const app = express()
setupMiddleware(app)

export default app
