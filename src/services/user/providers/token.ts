import { PrismaClient, Prisma } from '@prisma/client'

const prisma = new PrismaClient()

export const createToken = async (createOption: Prisma.TokenCreateArgs) => {
    return await prisma.token.create(createOption)
}
export const updateToken = async (updateOption: Prisma.TokenUpdateManyWithWhereWithoutAuthorInput) => {
    await prisma.token.updateMany(updateOption)
}
export const getToken = async (id: number) => {
    return await prisma.token.findUnique({ where: { id } })
}
export const logginToken = async (createOption: Prisma.logTokenCreateArgs) => {
    return await prisma.logToken.create(createOption)
}