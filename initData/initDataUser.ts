import { Prisma, PrismaClient } from '@prisma/client';
import * as userProvider from "../src/services/user/providers/user"
import * as crypto from "../src/utils/crypto"
import users from "./users.json"
import posts from "./posts.json"

// Create an instance of the Prisma client
const prisma = new PrismaClient();

// Function to create a new user
async function createUser() {
  try {
    // Use the Prisma client to create a new user
    users.forEach(async requestBody => {
      requestBody["password"] = await crypto.hash("password")
      const options: Prisma.UserCreateArgs = {
        data: {
          email: requestBody.email,
          name: requestBody.name,
          phone: requestBody.phone,
          website: requestBody.website,
          username: requestBody.username,
          password: requestBody["password"],
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
      const newUser = await prisma.user.create(options);
    })

  } catch (error) {
    console.error('Error creating user:');
  } finally {
    // Close the Prisma client connection
    await prisma.$disconnect();
  }
}

createUser()
