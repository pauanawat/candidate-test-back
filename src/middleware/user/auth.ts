import { NextFunction, Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import { PROCESS_ENV, TOKEN_STATUS } from '../../const'
import { UserRequest } from '../../const/interface'
import { getUser } from '../../services/user/providers/user'
import * as ErrorHandler from '../../utils/error_handler'
import { HTTP401Error } from '../../utils/http_errors'
import { Token, User } from '@prisma/client'
import { getToken } from '../../services/user/providers/token'

type mayString = string | undefined
type mayUser = User | null
type decToken = {
  id: string
  token: string
  iat: number
  exp: number
}

export default function (req: Request, res: Response, next: NextFunction) {
  const authHeader: mayString = req.get('Authorization')
  let token: string = ''

  if (!authHeader) {
    console.warn('unauthorize')
    ErrorHandler.unauthorizedError()
  } else {
    token = authHeader?.split(' ')[1]
  }

  let decodedToken: decToken
  try {
    decodedToken = <decToken>jwt.verify(token, PROCESS_ENV.JWT_SECRET)

    CheckUserStatus(decodedToken, token, req, res, next)
  } catch (err: any) {
    console.error(err.message || 'no message')
    ErrorHandler.clientError(new HTTP401Error('unauthorized'), res, next)
  }
}

async function CheckUserStatus(
  decodedToken: decToken,
  token: string,
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {

    let userToken: Token = await getToken(parseInt(decodedToken.token))
    if (!userToken || userToken.status === TOKEN_STATUS.EXPIRED) throw new HTTP401Error()

    getUser({ where: { id: parseInt(decodedToken.id) } })
      .then((user: mayUser) => {
        if (!user) {
          throw new HTTP401Error()
        } else {
          ; (<UserRequest>req).user = user
            ; (<UserRequest>req).token = token
        }
        next()
      })
      .catch((err: any) => {
        ErrorHandler.clientError(err, res, next)
      })
  } catch (err) {
    ErrorHandler.clientError(err, res, next)
  }
}