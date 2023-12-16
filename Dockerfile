# Stage 1: Build the application
FROM node:latest AS build
WORKDIR /project/api

COPY package*.json ./
RUN npm install
COPY . .
RUN npx prisma init --datasource-provider sqlite
RUN npx prisma generate --schema=./src/prisma/schema.prisma

RUN npx tsc  

EXPOSE 3001
CMD ["node", "./dist/src/app.js"]
