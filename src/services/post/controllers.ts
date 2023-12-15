import { NextFunction, Request, Response } from 'express'
import moment from 'moment'
import jwt from 'jsonwebtoken'
import * as ErrorHandler from '../../utils/error_handler'
import { HTTP401Error } from '../../utils/http_errors'
import * as postProvider from './providers/post'
import * as tokenProvider from '../user/providers/token'
import * as crypto from '../../utils/crypto'
import { Address, Company, Geo, Prisma, Post } from '@prisma/client'
import { PROCESS_ENV, TOKEN_STATUS } from '../../const'
import { assertUserRequest } from '../../utils/check_request'

export const createPost = async (req: Request, res: Response, next: NextFunction) => {
  try {
    console.log("createPost")
    assertUserRequest(req)
    const requestBody: Post = req.body
    const currentDate = moment().format('YYYY-MM-DD HH:mm:ss')
    const options: Prisma.PostCreateArgs = {
      data: {
        userId: requestBody.userId,
        title: requestBody.title,
        body: requestBody.body,
        createAt: currentDate,
        updateAt: currentDate
      }
    }
    let posts = await postProvider.createPost(options)
    await tokenProvider.logginToken({ data: { token: req.token, action: "create post", target: "postId " + posts.id } })
    return res.json({ posts, message: "success" })
  } catch (err) {
    ErrorHandler.handleAll(err, res, next)
  }
}
export const updatePost = async (req: Request, res: Response, next: NextFunction) => {
  try {
    console.log("updatePost")
    assertUserRequest(req)
    let postId = parseInt(req.params.id)
    const requestBody: Post = req.body
    let postOptions: Prisma.PostUpdateArgs = {
      data: {
        userId: requestBody.userId,
        title: requestBody.title,
        body: requestBody.body
      }, where: { id: postId }
    }
    const post = await postProvider.updatePost(postOptions)

    await tokenProvider.logginToken({ data: { token: req.token, action: "put post", target: "postId " + post.id } })
    return res.status(202).json({ data: post, message: "success" })
  } catch (err) {
    ErrorHandler.handleAll(err, res, next)
  }
}
export const patchPost = async (req: Request, res: Response, next: NextFunction) => {
  try {
    console.log("patchPost")
    assertUserRequest(req)
    let postId = parseInt(req.params.id)
    const requestBody: Post = req.body
    let post: Post
    let postOptions: Prisma.PostUpdateArgs = {
      data: {}, where: { id: postId }
    }
    if (requestBody.title) postOptions['data']['title'] = requestBody.title
    if (requestBody.body) postOptions['data']['body'] = requestBody.body
    if (Object.keys(postOptions.data).length !== 0)
      post = await postProvider.updatePost(postOptions)

    await tokenProvider.logginToken({ data: { token: req.token, action: "patch post", target: "postId " + post.id } })
    return res.status(202).json({ data: post, message: "success" })
  } catch (err) {
    ErrorHandler.handleAll(err, res, next)
  }
}
export const getPosts = async (req: Request, res: Response, next: NextFunction) => {
  try {
    assertUserRequest(req)
    let queryParam = req.query
    let postOptions: Prisma.PostFindManyArgs = {
      where: {},
    }
    // map post attribute
    if (queryParam.id && typeof (queryParam.id) == "string")
      postOptions['where']['id'] = parseInt(queryParam.id)
    if (queryParam.userId && typeof (queryParam.userId) == "string")
      postOptions['where']['userId'] = parseInt(queryParam.userId)
    if (queryParam.title && typeof (queryParam.title) == "string")
      postOptions['where']['title'] = { "contains": queryParam.title }
    if (queryParam.body && typeof (queryParam.body) == "string")
      postOptions['where']['body'] = { "contains": queryParam.body }
    const posts = await postProvider.getPostList(postOptions)
    await tokenProvider.logginToken({ data: { token: req.token, action: "get posts", target: "" } })
    return res.json({ posts })
  } catch (err) {
    ErrorHandler.handleAll(err, res, next)
  }
}
export const getPostById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    assertUserRequest(req)
    const id = parseInt(req.params.id)
    const options: Prisma.PostFindUniqueArgs = {
      where: { id },
    }
    const post = await postProvider.getPost(options)
    await tokenProvider.logginToken({ data: { token: req.token, action: "get post by id", target: "postId " + id } })
    return res.json({ post: post })
  } catch (err) {
    ErrorHandler.handleAll(err, res, next)
  }
}
export const deletePost = async (req: Request, res: Response, next: NextFunction) => {
  try {
    assertUserRequest(req)
    const id = parseInt(req.params.id)
    const options: Prisma.PostDeleteArgs = {
      where: { id }
    }
    postProvider.deletePost(options).then(async posts => {
      await tokenProvider.logginToken({ data: { token: req.token, action: "delete post", target: "postId " + posts.id } })
      return res.json({ posts, message: "success" })
    })
  } catch (err) {
    ErrorHandler.handleAll(err, res, next)
  }
}
export const getFeedList = async (req: Request, res: Response, next: NextFunction) => {
  try {
    let queryParam = req.query
    let postOptions: Prisma.PostFindManyArgs = {
      where: {},
      include: { author: true }
    }
    if (queryParam.userId && typeof (queryParam.userId) == "string")
      postOptions.where['userId'] = parseInt(queryParam.userId)
    const feeds = await postProvider.getFeedList(postOptions)
    return res.json({ feeds, message: "success" })
  } catch (err) {
    ErrorHandler.handleAll(err, res, next)
  }
}