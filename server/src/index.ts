import dotenv from 'dotenv';

import 'reflect-metadata';
import { resolve } from 'path';
import { ApolloServer } from 'apollo-server';
import { buildSchema } from 'type-graphql';
import AuthContext from './auth/AuthContext';
import {
  UserResolver,
  TimeEntryResolver,
  CourseResolver,
  SpecialtyResolver,
  SubtopicResolver,
  TopicResolver,
} from './resolvers';

dotenv.config();

(async () => {
  const schema = await buildSchema({
    resolvers: [
      UserResolver,
      TimeEntryResolver,
      CourseResolver,
      SpecialtyResolver,
      SubtopicResolver,
      TopicResolver,
    ],
    emitSchemaFile: resolve(__dirname, 'schema.gql'),
  });

  const server = new ApolloServer({
    schema,
    cors: {
      origin: process.env.CORS_ORIGIN,
      credentials: true,
    },
    playground: {
      settings: {
        'request.credentials': 'same-origin',
      },
    },
    context: async (ctx) => {
      const authCtx = await AuthContext.create(ctx.req);
      return {
        ...ctx,
        auth: authCtx,
      };
    },
  });

  const { url } = await server.listen(process.env.PORT);
  // eslint-disable-next-line no-console
  console.log(`Server ready at ${url}`);
})();
