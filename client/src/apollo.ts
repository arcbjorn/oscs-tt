import { ApolloClient, HttpLink, InMemoryCache } from '@apollo/client';

const link = new HttpLink({
  uri: process.env.VUE_APP_API_URL,
  // credentials: 'include',
});

const client = new ApolloClient({
  link,
  cache: new InMemoryCache(),
});

export default client;
