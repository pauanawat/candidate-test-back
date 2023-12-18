# Stage 1: Build the application
FROM node:latest AS build
WORKDIR /project/api

ARG NODE_ENV
ENV NODE_ENV $NODE_ENV
ARG JWT_SECRET
ENV JWT_SECRET $JWT_SECRET

COPY package*.json ./
RUN npm install
COPY . .
RUN npx prisma init --datasource-provider sqlite
RUN npx prisma generate --schema=./src/prisma/schema.prisma

RUN npx tsc  

CMD ["node", "./dist/src/app.js"]
