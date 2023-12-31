import { Prisma, PrismaClient } from '@prisma/client';
import * as crypto from "../src/utils/crypto"
import users from "./users.json"

// Create an instance of the Prisma client
const prisma = new PrismaClient();

// Function to create a new user
export async function createUser() {
  try {
    // Use the Prisma client to create a new user
    for (const requestBody of users) {
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
      await prisma.user.create(options);
    }

  } catch (error) {
    // console.error('Error creating user:');
  } finally {
    // Close the Prisma client connection
    await prisma.$disconnect();
  }
}
