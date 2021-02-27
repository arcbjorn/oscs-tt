import React, { Suspense, lazy } from 'react';
import { Redirect, Route, Switch, BrowserRouter as Router } from 'react-router-dom';

import { useQuery } from '@apollo/client';
import { loader } from 'graphql.macro';
import './i18n/config';

const SignInAndSignUpPage = lazy(() => import('./views/SignInAndSignUpPage'));
const LandingPage = lazy(() => import('./views/LandingPage'));

const AUTH = loader('./gql/queries/auth/AuthData.gql');

const Root: React.FC = () => {
  const { data, error } = useQuery(AUTH);
  console.log(data, error, AUTH);

  return (
    <Router>
      <Suspense fallback={<div>Loading...</div>}>
        <Switch>
          <Route exact path="/" component={LandingPage} />
          <Route
            exact
            path="/signin"
            render={() => (data ? <Redirect to="/" /> : <SignInAndSignUpPage />)}
          />
        </Switch>
      </Suspense>
    </Router>
  );
};

export default Root;
