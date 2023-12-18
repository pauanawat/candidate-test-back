// Import your Prisma client
import { Prisma, PrismaClient } from '@prisma/client';
import * as crypto from "../src/utils/crypto"
import users from "./users.json"
import posts from "./posts.json"
import moment from 'moment';

// Create an instance of the Prisma client
const prisma = new PrismaClient();

export async function createPost() {
  try {
    const currentDate = moment().format('YYYY-MM-DD HH:mm:ss')
    // Use the Prisma client to create a new user
    for (const requestBody of posts) {
      const options: Prisma.PostCreateArgs = {
        data: {
          id: requestBody.id,
          userId: requestBody.userId,
          title: requestBody.title,
          body: requestBody.body,
          createAt: currentDate,
          updateAt: currentDate
        },
      }
      await prisma.post.create(options);
    }

  } catch (error) {
    // console.error('Error creating post:');
  } finally {
    // Close the Prisma client connection
    await prisma.$disconnect();
  }
}
