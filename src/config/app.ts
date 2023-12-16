const bodyParser = require('body-parser')
import express, { NextFunction, Request, Response } from 'express'
import swaggerUi from 'swagger-ui-express';
import swaggerDocument from "./swager.json"
import routes from '../services'
import { applyMiddleware, applyRoutes } from '../utils'
import errorHandlers from '../middleware/error_handlers'

const app = express()
// generate swager.json
// import expressOasGenerator from 'express-oas-generator'
// expressOasGenerator.init(app,
//   function (spec) { return spec; },
//   'swager.json',
//   60 * 1000,
//   'api-docs',);
app.use(bodyParser.json({ limit: '10mb' }))
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }))

app.use((req: Request, res: Response, next: NextFunction) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET, POST, PUT, PATCH, DELETE')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  next()
})

// Serve Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

applyRoutes(routes, app)
applyMiddleware(errorHandlers, app)

export default app
