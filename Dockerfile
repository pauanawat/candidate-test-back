# Stage 1: Build the application
FROM node:latest AS build
WORKDIR /project/api

COPY package*.json ./
RUN npm install && npm install typescript@4.1.6 -g
RUN npm install prisma --save-dev
RUN npx prisma init --datasource-provider sqlite
COPY . .

RUN npx tsc  

EXPOSE 3001
CMD ["node", "./dist/src/app.js"]
