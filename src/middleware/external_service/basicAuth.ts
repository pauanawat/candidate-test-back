import { NextFunction, Request, Response } from 'express'
import * as ErrorHandler from '../../utils/error_handler'
import { HTTP401Error } from '../../utils/http_errors'

type mayString = string | undefined

export default function (req: Request, res: Response, next: NextFunction) {
  const authHeader: mayString = req.get('Authorization')
  let token: string = ''

  if (authHeader?.split(' ')[0] != 'Basic') {
    console.warn('unauthorize')
    ErrorHandler.unauthorizedError()
  } else {
    token = authHeader?.split(' ')[1]
  }

  authenticate(token, req, res, next)
}

function authenticate(base64Credentials: string, req: Request, res: Response, next: NextFunction) {
  const internalUsername = '4F-X68Sb4#aPpwnHhNi?5e_wC&$MP?'
  const internalPassword = 'zM[Rx[uaP9R@bgR4@Zip!6-&8i0v3N'

  const credentials = Buffer.from(base64Credentials, 'base64').toString('ascii')
  const [username, password] = credentials.split(':')

  if (username == internalUsername && password == internalPassword) {
    next()
  } else {
    ErrorHandler.clientError(new HTTP401Error('unauthorized'), res, next)
  }
}
