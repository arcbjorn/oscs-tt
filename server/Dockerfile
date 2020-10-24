# develop stage
FROM node:lts-alpine as develop-stage
WORKDIR /app
RUN chown node:node /app
USER node
COPY package*.json .
COPY yarn.lock .
RUN yarn install
COPY . .
# build stage
FROM develop-stage as build-stage
RUN yarn build
# production stage
FROM build-stage as production-stage
EXPOSE 8081
USER root
USER node
CMD ["node", "dist/index.js"]
