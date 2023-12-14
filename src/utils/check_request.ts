import { Request } from 'express'
import { HTTP403Error } from './http_errors'
import { UserRequest } from '../const/interface'

export function assertUserRequest(req: Request | UserRequest): asserts req is UserRequest {
  if ('user' in req) {
    return
  } else {
    throw new HTTP403Error('Request was not a UserRequest')
  }
}