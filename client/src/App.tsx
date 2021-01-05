import React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import { loader } from 'graphql.macro';
import './i18n/config';

import Container from '@material-ui/core/Container';

import SignInAndSignUpPage from './views/SignInAndSignUpPage';
import LandingPage from './views/LandingPage';

const auth = loader('./gql/queries/auth/AuthData.graphql');

const App: React.FC = () => {
  const { data } = useQuery(auth);

  return (
    <Container>
      <Switch>
        <Route exact path="/" component={LandingPage} />
        <Route
          exact
          path="/signin"
          render={() => (data ? <Redirect to="/" /> : <SignInAndSignUpPage />)}
        />
      </Switch>
    </Container>
  );
};

export default App;
