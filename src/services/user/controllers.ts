import { NextFunction, Request, Response } from 'express'
import moment from 'moment'
import jwt from 'jsonwebtoken'
import * as ErrorHandler from '../../utils/error_handler'
import { HTTP401Error } from '../../utils/http_errors'
import * as userProvider from './providers/user'
import * as tokenProvider from './providers/token'
import * as crypto from '../../utils/crypto'
import { Address, Company, Geo, Prisma, User } from '@prisma/client'
import { PROCESS_ENV, TOKEN_STATUS } from '../../const'
import { assertUserRequest } from '../../utils/check_request'

type IAccount = {
  username: string
  password: string
}
type decToken = {
  id: string
  token: string
}
export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const requestBody: IAccount = req.body
    const userOptions: Prisma.UserFindUniqueArgs = {
      where: { username: requestBody.username },
    }
    let user = await userProvider.getUser(userOptions)
    if (!user || !crypto.compare(requestBody.password, user.password))
      throw new HTTP401Error()
    const tokenUpdateOptions: Prisma.TokenUpdateManyWithWhereWithoutAuthorInput = {
      data: { status: TOKEN_STATUS.EXPIRED },
      where: { userId: user.id },
    }
    await tokenProvider.updateToken(tokenUpdateOptions)
    console.log("update old token")
    const tokenCreateOptions: Prisma.TokenCreateArgs = {
      data: {
        userId: user.id,
        status: TOKEN_STATUS.USED,
        expireAt: moment().add(1, 'days').format('YYYY-MM-DD HH:mm:ss')
      },
    }
    const token = await tokenProvider.createToken(tokenCreateOptions)
    console.log("create new token")
    let enc: decToken = {
      id: user.id.toString(),
      token: token.id.toString(),
    }

    return res.status(200).json({
      token: jwt.sign(enc, PROCESS_ENV.JWT_SECRET, {
        expiresIn: '1d',
      }),
      userId: user.id
    })
  } catch (err) {
    ErrorHandler.handleAll(err, res, next)
  }
}
export const createUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    console.log("createUser")
    assertUserRequest(req)
    const requestBody: userProvider.IUser = req.body
    requestBody.password = await crypto.hash(requestBody.password)
    const options = {
      data: {
        email: requestBody.email,
        name: requestBody.name,
        phone: requestBody.phone,
        website: requestBody.website,
        username: requestBody.username,
        password: requestBody.password,
        address: {
          create: {
            street: requestBody.address.street,
            suite: requestBody.address.suite,
            city: requestBody.address.city,
            zipcode: requestBody.address.zipcode,
            // Add other address properties as needed
            geo: {
              create: {
                lat: requestBody.address.geo.lat,
                lng: requestBody.address.geo.lng,
              },
            },
          },
        },
        company: {
          create: {
            name: requestBody.company.name,
            catchPhrase: requestBody.company.catchPhrase,
            bs: requestBody.company.bs,
          },
        },
      },
    }
    let users = await userProvider.createUser(options)
    delete users.password
    await tokenProvider.logginToken({ data: { token: req.token, action: "create user", target: "userId " + users.id } })
    return res.json({ users, message: "success" })
  } catch (err) {
    ErrorHandler.handleAll(err, res, next)
  }
}
export const updateUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    console.log("updateUser")
    assertUserRequest(req)
    let userId = parseInt(req.params.id)
    const requestBody: userProvider.IUser = req.body
    let userOptions: Prisma.UserUpdateArgs = {
      data: {
        email: requestBody.email,
        name: requestBody.name,
        phone: requestBody.phone,
        website: requestBody.website,
      }, where: { id: userId }
    }
    const user = await userProvider.updateUser(userOptions)
    let addressOptions: Prisma.AddressUpdateArgs = {
      data: {
        street: requestBody.address.street,
        suite: requestBody.address.suite,
        city: requestBody.address.city,
        zipcode: requestBody.address.zipcode,
      }, where: { userId: userId }
    }
    const address = await userProvider.updateAddress(addressOptions)
    let geoOptions: Prisma.GeoUpdateArgs = {
      data: {
        lat: requestBody.address.geo.lat,
        lng: requestBody.address.geo.lng,
      }, where: { addressId: address.id }
    }
    const geo = await userProvider.updateGeo(geoOptions)
    let companyOptions: Prisma.CompanyUpdateArgs = {
      data: {
        name: requestBody.company.name,
        catchPhrase: requestBody.company.catchPhrase,
        bs: requestBody.company.bs,
      }, where: { userId: userId }
    }
    const company = await userProvider.updateCompany(companyOptions)
    let result = user
    result['address'] = address
    result['address']['geo'] = geo
    result['company'] = company
    if ('password' in result) delete result.password

    await tokenProvider.logginToken({ data: { token: req.token, action: "put user", target: "userId " + user.id } })
    return res.status(202).json({ data: result, message: "success" })
  } catch (err) {
    ErrorHandler.handleAll(err, res, next)
  }
}
export const patchUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    console.log("patchUser")
    assertUserRequest(req)
    let userId = parseInt(req.params.id)
    const requestBody: userProvider.IUser = req.body
    let user: User
    let address: Address
    let geo: Geo
    let company: Company
    let userOptions: Prisma.UserUpdateArgs = {
      data: {}, where: { id: userId }
    }
    if (requestBody.email) userOptions['data']['email'] = requestBody.email
    if (requestBody.name) userOptions['data']['name'] = requestBody.name
    if (requestBody.phone) userOptions['data']['phone'] = requestBody.phone
    if (requestBody.website) userOptions['data']['website'] = requestBody.website
    if (Object.keys(userOptions.data).length !== 0)
      user = await userProvider.updateUser(userOptions)
    let addressOptions: Prisma.AddressUpdateArgs = {
      data: {}, where: { userId: userId }
    }
    if (requestBody.address.street) addressOptions['data']['street'] = requestBody.address.street
    if (requestBody.address.suite) addressOptions['data']['suite'] = requestBody.address.suite
    if (requestBody.address.city) addressOptions['data']['city'] = requestBody.address.city
    if (requestBody.address.zipcode) addressOptions['data']['zipcode'] = requestBody.address.zipcode
    if (Object.keys(addressOptions.data).length !== 0)
      address = await userProvider.updateAddress(addressOptions)
    let geoOptions: Prisma.GeoUpdateArgs = {
      data: {}, where: { addressId: null }
    }
    if (requestBody.address.geo.lat) geoOptions['data']['lat'] = requestBody.address.geo.lat
    if (requestBody.address.geo.lng) geoOptions['data']['lng'] = requestBody.address.geo.lng
    if (Object.keys(geoOptions).length !== 0) {
      if (!address) address = await userProvider.getAddressByUserId(requestBody.id)
      geoOptions.where.addressId = address.id
      geo = await userProvider.updateGeo(geoOptions)
    }
    let companyOptions: Prisma.CompanyUpdateArgs = {
      data: {}, where: { userId: userId }
    }
    if (requestBody.company.name) userOptions['data']['name'] = requestBody.company.name
    if (requestBody.company.catchPhrase) userOptions['data']['catchPhrase'] = requestBody.company.catchPhrase
    if (requestBody.company.bs) userOptions['data']['bs'] = requestBody.company.bs
    if (Object.keys(companyOptions).length !== 0)
      company = await userProvider.updateCompany(companyOptions)
    let result = {}
    if (user) result = user
    if (address) result['address'] = address
    if (geo) result['address']['geo'] = geo
    if (company) result['company'] = company
    if ('password' in result) delete result.password
    await tokenProvider.logginToken({ data: { token: req.token, action: "patch user", target: "userId " + user.id } })
    return res.status(202).json({ data: result, message: "success" })
  } catch (err) {
    ErrorHandler.handleAll(err, res, next)
  }
}
export const getUsers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    assertUserRequest(req)
    let queryParam = req.query
    let userOptions: Prisma.UserFindManyArgs = {
      where: {},
      include: {
        address: {
          include: {
            geo: true,
          }
        },
        company: true,
      }
    }
    // prepare address and geo attribute
    if (queryParam.street || queryParam.suite || queryParam.city || queryParam.zipcode) {
      userOptions['where']['address'] = {}
      if (queryParam.lat || queryParam.lng)
        userOptions['where']['address']['geo'] = {}
    }
    // prepare company attribute
    if (queryParam.name || queryParam.catchPhrase || queryParam.bs) {
      userOptions['where']['company'] = {}
    }
    // map user attribute
    if (queryParam.id && typeof (queryParam.id) == "string")
      userOptions['where']['id'] = parseInt(queryParam.id)
    if (queryParam.email && typeof (queryParam.email) == "string")
      userOptions['where']['email'] = { "contains": queryParam.email }
    if (queryParam.name && typeof (queryParam.name) == "string")
      userOptions['where']['name'] = { "contains": queryParam.name }
    if (queryParam.phone && typeof (queryParam.phone) == "string")
      userOptions['where']['phone'] = { "contains": queryParam.phone }
    if (queryParam.website && typeof (queryParam.website) == "string")
      userOptions['where']['website'] = { "contains": queryParam.website }
    // map address and geo attribute
    if (queryParam.street && typeof (queryParam.street) == "string")
      userOptions['where']['address']['street'] = { "contains": queryParam.street }
    if (queryParam.suite && typeof (queryParam.suite) == "string")
      userOptions['where']['address']['suite'] = { "contains": queryParam.suite }
    if (queryParam.city && typeof (queryParam.city) == "string")
      userOptions['where']['address']['city'] = { "contains": queryParam.city }

    if (queryParam.zipcode && typeof (queryParam.zipcode) == "string")
      userOptions['where']['address']['zipcode'] = queryParam.zipcode
    if (queryParam.lat && typeof (queryParam.lat) == "string")
      userOptions['where']['address']['geo']['lat'] = queryParam.lat
    if (queryParam.lng && typeof (queryParam.lng) == "string")
      userOptions['where']['address']['geo']['lng'] = queryParam.lng
    // map company attribute
    if (queryParam.companyName && typeof (queryParam.companyName) == "string")
      userOptions['where']['company']['name'] = { "contains": queryParam.companyName }
    if (queryParam.catchPhrase && typeof (queryParam.catchPhrase) == "string")
      userOptions['where']['company']['catchPhrase'] = { "contains": queryParam.catchPhrase }
    if (queryParam.bs && typeof (queryParam.bs) == "string")
      userOptions['where']['company']['bs'] = { "contains": queryParam.bs }
    userProvider.getUserList(userOptions).then(async users => {
      let result = users.map(user => {
        delete user.password
        return user
      })
      await tokenProvider.logginToken({ data: { token: req.token, action: "get users", target: "" } })
      return res.json({ result })
    })
  } catch (err) {
    ErrorHandler.handleAll(err, res, next)
  }
}
export const getUserById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    assertUserRequest(req)
    const id = parseInt(req.params.id)
    const options: Prisma.UserFindUniqueArgs = {
      where: { id },
      include: {
        address: {
          include: {
            geo: true,
          }
        },
        company: true
      },
    }
    userProvider.getUser(options).then(async user => {
      delete user.password
      await tokenProvider.logginToken({ data: { token: req.token, action: "get user by id", target: "userId " + id } })
      return res.json({ user: user })
    })
  } catch (err) {
    ErrorHandler.handleAll(err, res, next)
  }
}
export const deleteUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    assertUserRequest(req)
    const id = parseInt(req.params.id)
    const options: Prisma.UserDeleteArgs = {
      where: { id }
    }
    userProvider.deleteUser(options).then(async users => {
      delete users.password
      await tokenProvider.logginToken({ data: { token: req.token, action: "delete user", target: "userId " + users.id } })
      return res.json({ users, message: "success" })
    })
  } catch (err) {
    ErrorHandler.handleAll(err, res, next)
  }
}