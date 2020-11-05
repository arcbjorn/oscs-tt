import dotenv from 'dotenv';

import 'reflect-metadata';
import { resolve } from 'path';
import { ApolloServer } from 'apollo-server';
import { buildSchema } from 'type-graphql';
import { TimeEntryResolver, TopicResolver } from './resolvers';

dotenv.config();

(async () => {
  const schema = await buildSchema({
    resolvers: [TimeEntryResolver, TopicResolver],
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
  });

  const { url } = await server.listen(process.env.PORT);
  // eslint-disable-next-line no-console
  console.log(`Server ready at ${url}`);
})();
