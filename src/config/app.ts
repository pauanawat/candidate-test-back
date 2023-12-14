const bodyParser = require('body-parser')
import express, { NextFunction, Request, Response } from 'express'
import routes from '../services'
import { applyMiddleware, applyRoutes } from '../utils'
import errorHandlers from '../middleware/error_handlers'

const app = express()
app.use(bodyParser.json({ limit: '10mb' }))
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }))

app.use((req: Request, res: Response, next: NextFunction) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET, POST, PUT, PATCH, DELETE')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  next()
})

applyRoutes(routes, app)
applyMiddleware(errorHandlers, app)

export default app
