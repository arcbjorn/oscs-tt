import { ApolloClient } from '@apollo/client';
import { loader } from 'graphql.macro';
import jwtDecode from 'jwt-decode';

import {
  AuthData,
  AuthResult,
  LoginMutation,
  LoginMutationVariables,
  LogoutMutation,
  LogoutMutationVariables,
} from '../gql/types';

const gqlAuthDataQuery = loader('../gql/queries/auth/AuthData.gql');
const gqlLoginMutation = loader('../gql/mutations/auth/Login.gql');
const gqlLogoutMutation = loader('../gql/mutations/auth/Logout.gql');

export const getAuthData = (client: ApolloClient<unknown>): AuthData => {
  const data = client.readQuery({
    query: gqlAuthDataQuery,
  });
  return data?.auth || {};
};

export const setAuthData = (client: ApolloClient<unknown>, data: AuthResult): void => {
  const { accessToken, refreshTokenExpiry } = data;
  const { id, email, name, accessTokenExpiry } = jwtDecode<AuthData>(accessToken);

  client.writeQuery({
    query: gqlAuthDataQuery,
    data: {
      auth: {
        __typename: 'AuthData',
        id,
        email,
        name,
        accessToken,
        accessTokenExpiry: accessTokenExpiry * 1000,
        refreshTokenExpiry: refreshTokenExpiry * 1000,
      },
    },
  });
};

export const resetAuthData = (client: ApolloClient<unknown>): void =>
  client.writeQuery({
    query: gqlAuthDataQuery,
    data: {
      auth: {
        __typename: 'AuthData',
        id: '',
        name: '',
        email: '',
        accessToken: '',
        accessTokenExpiry: 0,
        refreshTokenExpiry: 0,
      },
    },
  });

export const login = async (
  client: ApolloClient<unknown>,
  email: string,
  password: string
): Promise<string | null | undefined> => {
  const result = await client.mutate<LoginMutation, LoginMutationVariables>({
    mutation: gqlLoginMutation,
    variables: {
      email,
      password,
    },
    update: (cache, { data }) => {
      if (data?.login) {
        setAuthData(client, data?.login);
      }
    },
  });
  return result.data?.login.error;
};

export const logout = async (client: ApolloClient<unknown>): Promise<void> => {
  resetAuthData(client);
  await client.mutate<LogoutMutation, LogoutMutationVariables>({
    mutation: gqlLogoutMutation,
  });
};

export const refreshAuthToken = async (client: ApolloClient<unknown>): Promise<void> => {
  try {
    // TODO: Implemet User Data fetch query here
    // const { data } = await client.query<VersionQuery, VersionQueryVariables>({
    //   query: gqlVersionQuery,
    //   fetchPolicy: 'no-cache',
    // });
    // console.log(`API version: ${data.version}`);
  } catch (e) {
    console.log('Auth session is not restored:', e);
  }
};

export const can = (): boolean => {
  console.log('TODO: Implement access rights checking');
  return true;
};

// TODO: Implement Navigation Guards
// export const authRouterGuard: NavigationGuard = async (to, from, next) => {
//   let redirect = '';
//   // Check if route required logout
//   if (to.matched.some((route) => route.meta.forceLogout)) {
//     await logout(client);
//   }

//   const auth = getAuthData();

//   if (
//     to.matched.every((route) => {
//       // Skip auth check if route.meta or route.meta.auth is not defined
//       if (typeof route.meta?.auth === 'undefined') {
//         return true;
//       }
//       // Deny routes available for non-authorized users only (sign in, sign up etc.)
//       if (auth?.id && route.meta?.auth === null) {
//         if (!redirect) {
//           redirect = 'home';
//         }
//         return false;
//       }
//       // Deny routes available for authorized users
//       if (!auth?.id && route.meta?.auth) {
//         return false;
//       }
//       // Check access using user rights and route policy
//       return can();
//     })
//   ) {
//     // console.log('ALLOW');
//     next();
//   } else if (redirect) {
//     // console.log('DENY (redirect)', to);
//     next({ name: redirect });
//   } else {
//     // console.log('DENY (require login)', to);
//     next({ name: 'sign-in', query: { r: to.fullPath } });
//   }
// };
