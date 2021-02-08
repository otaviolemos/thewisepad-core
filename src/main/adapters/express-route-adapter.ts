import { WebController, HttpRequest } from '@/presentation/web-controllers/ports'
import { Request, Response } from 'express'

export const adaptRoute = (controller: WebController) => {
  return async (req: Request, res: Response) => {
    const httpRequest: HttpRequest = {
      body: req.body
    }
    const httpResponse = await controller.handle(httpRequest)
    res.status(httpResponse.statusCode).json(httpResponse.body)
  }
}
