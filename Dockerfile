# Stage 1: Build the application
FROM node:latest AS build
WORKDIR /project/api

COPY package*.json ./
RUN npm install && npm install typescript@4.1.6 -g
RUN npm install prisma --save-dev
COPY . .

# Init sqlite (dev.db)
RUN npx prisma init --datasource-provider sqlite
RUN npx tsc  

EXPOSE 3001
CMD ["node", "./dist/src/app.js"]
