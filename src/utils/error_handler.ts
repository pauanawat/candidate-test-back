import { NextFunction, Response } from 'express'
import { Prisma } from '@prisma/client'
import {
  HTTP400Error,
  HTTP401Error,
  HTTP403Error,
  HTTP404Error,
  HTTPClientError,
} from '../utils/http_errors'

export const notFoundError = (): never => {
  throw new HTTP404Error('route not found.')
}

export const unauthorizedError = (): never => {
  throw new HTTP401Error('unauthorized.')
}

export const forbiddenError = (): never => {
  throw new HTTP403Error('forbidden')
}

export const badRequestError = (message?: string | object): never => {
  throw new HTTP404Error(message || 'bad request')
}

export const checkReqType = (err: any, res: Response, next: NextFunction) => {
  if (err?.message === 'Request was not a UserRequest') {
    console.warn(err)
    res.status(401).send('unauthorized')
  } else {
    next(err)
  }
}
export const clientError = (err: any, res: Response, next: NextFunction) => {
  if (err instanceof HTTPClientError) {
    console.warn(err)
    res.status(err.statusCode).send(err.message)
  } else {
    next(err)
  }
}
export const serverError = (err: any, res: Response, next: NextFunction) => {
  console.error(err)
  res.status(500).send(err.stack)
}
export const handleAll = (err: any, res: Response, next: NextFunction) => {
  // logger.error(err)
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    let message: string = err?.message || ''
    clientError(new HTTP400Error(message), res, next)
  } else if (err instanceof HTTPClientError) {
    // console.warn(err)
    res.status(err.statusCode).send(err.message)
  } else {
    // console.log(err)
    res.status(500).json(err?.message || err)
  }
}
