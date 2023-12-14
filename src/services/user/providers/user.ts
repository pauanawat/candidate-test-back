import { PrismaClient, Prisma, User, Address, Geo, Company } from '@prisma/client'

const prisma = new PrismaClient()

export interface IUser extends User {
  password: string
  address: IAddress
  company: Company
}
interface IAddress extends Address {
  geo: Geo
}
export const createUser = async (createOption: Prisma.UserCreateArgs) => {
  return await prisma.user.create(createOption)
}
export const updateUser = async (updateOption: Prisma.UserUpdateArgs) => {
  return await prisma.user.update(updateOption)
}
export const getAddressByUserId = async (id: number) => {
  return await prisma.address.findUnique({ where: { userId: id } })
}
export const updateAddress = async (updateOption: Prisma.AddressUpdateArgs) => {
  return await prisma.address.update(updateOption)
}
export const updateGeo = async (updateOption: Prisma.GeoUpdateArgs) => {
  return await prisma.geo.update(updateOption)
}
export const updateCompany = async (updateOption: Prisma.CompanyUpdateArgs) => {
  return await prisma.company.update(updateOption)
}

export const getAllUsers = async () => {
  const users = await prisma.user.findMany({
    include: {
      address: {
        include: {
          geo: true,
        }
      },
      company: true,
      posts: true
    },
  })
  // TODO delete column address id, geo id
  return users
}
export const getUser = async (whereOption: Prisma.UserFindUniqueArgs) => {
  const user = await prisma.user.findUnique(whereOption)
  // TODO delete column address id, geo id
  return user
}
// get by filter
export const getUserList = async (whereOption: Prisma.UserFindManyArgs) => {
  return await prisma.user.findMany(whereOption)
}
export const deleteUser = async (whereOption: Prisma.UserDeleteArgs) => {
  return await prisma.user.delete(whereOption)
}