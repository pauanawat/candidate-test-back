# Stage 1: Build the application
FROM node:latest AS build
WORKDIR /project/api

COPY package*.json ./
RUN npm install
RUN npx prisma generate
RUN npx prisma init --datasource-provider sqlite
COPY . .

RUN npx tsc  

EXPOSE 3001
CMD ["node", "./dist/src/app.js"]
