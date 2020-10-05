# develop stage
FROM node:lts-alpine as develop-stage
WORKDIR /app
RUN chown node:node /app
USER node
COPY package*.json ./
COPY package-lock.json ./
RUN npm install
COPY ./ ./
# build stage
FROM develop-stage as build-stage
RUN npm run build