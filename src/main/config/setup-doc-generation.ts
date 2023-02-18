import { Express, Request } from 'express'
import fs from 'fs'
import morgan from 'morgan'

export default function configAppToGenerateDoc (app: Express) {
  const fileName = 'api-doc.json'
  overrideSendToAccessResponse(app)
  appendHeaderToFile(fileName)
  createMorganTokens()

  const format = (`
      ":url :randomId": {
        ":lowermethod": {
          "description": :description,
          "parameters": [
            {
              "in": "body",
              "name": "",
              "description": "",
              "schema": {
                  "type": "object",
                  "properties": {
                    :reqBodySchema
                  }
              }
            }
          ],
          "responses": {
            ":status": {
              "description": "",
              "schema": {
                "type": "object",
                "properties": {
                  :resBodySchema
                }
              }
            }
          }
        }
      },
  `)

  const accessLogStream = fs.createWriteStream(fileName, { flags: 'a' })
  app.use(morgan(format, { stream: accessLogStream }))
}

function createMorganTokens () {
  morgan.token('resBodySchema', function (req, res: any) {
    const responseBody = res.__custombody__
    if (!responseBody) {
      return ' '
    }
    if (Object.keys(responseBody).length === 0 || Object.keys(responseBody)[0] === '0') {
      return ' '
    }
    const lineBreakAndTabs = '\n\t\t\t\t\t\t\t\t\t\t\t'
    const responseBodySchema = Object.keys(responseBody).map((key) => {
      return `"${key}": {${lineBreakAndTabs}"type": "${typeof responseBody[key]}"${lineBreakAndTabs}}`
    }).join(`,${lineBreakAndTabs}`)
    if (responseBodySchema) {
      return responseBodySchema
    }
    return ' '
  })

  morgan.token('reqBodySchema', (req: Request, res) => {
    const reqBody = req.body
    const lineBreakAndTabs = '\n\t\t\t\t\t\t\t\t\t\t\t'
    const reqBodySchema = Object.keys(reqBody).map((key) => {
      return `"${key}": {${lineBreakAndTabs}"type": "${typeof reqBody[key]}"${lineBreakAndTabs}}`
    }).join(`,${lineBreakAndTabs}`)
    if (reqBodySchema) {
      return reqBodySchema
    }
    return ' '
  })

  morgan.token('lowermethod', (req: Request, res) => req.method.toLowerCase())
  morgan.token('randomId', (req: Request, res) =>
    Math.random().toString(36).substring(2, 5) + Math.random().toString(36).substring(2, 5))
  morgan.token('description', (req: Request) => `"${req.headers.description}"`)
}

function overrideSendToAccessResponse (app: Express) {
  const originalSend = app.response.send

  app.response.send = function sendOverWrite (body): any {
    originalSend.call(this, body)
    this.__custombody__ = body
  }
}

function appendHeaderToFile (fileName: string) {
  const header = getZionAPIDocHeader()
  if (!fs.existsSync(fileName)) {
    fs.appendFileSync(fileName, header)
  }
}

function getZionAPIDocHeader () {
  return `{
    "swagger": "2.0",
    "info": {
      "title": "API",
      "description": "API endpoints.",
      "version": "1.0.0"
    },
    "basePath": "/",
    "schemes": [
      "http"
    ],
    "paths": {
      `
}
