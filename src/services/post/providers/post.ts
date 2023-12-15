import { PrismaClient, Prisma } from '@prisma/client'

const prisma = new PrismaClient()

export const createPost = async (createOption: Prisma.PostCreateArgs) => {
  return await prisma.post.create(createOption)
}
export const updatePost = async (updateOption: Prisma.PostUpdateArgs) => {
  return await prisma.post.update(updateOption)
}
export const getAllPosts = async () => {
  return await prisma.post.findMany()
}
export const getPost = async (whereOption: Prisma.PostFindUniqueArgs) => {
  return await prisma.post.findUnique(whereOption)
}
// get by filter
export const getPostList = async (whereOption: Prisma.PostFindManyArgs) => {
  return await prisma.post.findMany(whereOption)
}
export const deletePost = async (whereOption: Prisma.PostDeleteArgs) => {
  return await prisma.post.delete(whereOption)
}
export const getFeedList = async (FeedFindManyArgs: Prisma.PostFindManyArgs) => {
  return await prisma.post.findMany(FeedFindManyArgs)
}