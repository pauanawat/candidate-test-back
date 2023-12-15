import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const getFeed = async (number: number) => {
    try {
        let feed = await prisma.post.findMany({ include: { author: true },take: number })
        console.log(feed)
    } catch (error) {

    }
}
getFeed(1)