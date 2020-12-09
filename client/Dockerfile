# develop stage
FROM node:lts-alpine as develop-stage
WORKDIR /app
RUN chown node:node /app
USER node
COPY package*.json ./
COPY yarn.lock ./
RUN yarn
COPY ./ ./
# build stage
FROM develop-stage as build-stage
RUN yarn build
