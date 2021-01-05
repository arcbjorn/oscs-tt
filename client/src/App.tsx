import React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import { ApolloProvider } from '@apollo/client';
import './i18n/config';

import Container from '@material-ui/core/Container';
import client from './apollo';

import SignInAndSignUpPage from './views/SignInAndSignUpPage';
import LandingPage from './views/LandingPage';

const App: React.FC = () => {
  const f = false;
  return (
    <ApolloProvider client={client}>
      <Container>
        <Switch>
          <Route exact path="/" component={LandingPage} />
          <Route
            exact
            path="/signin"
            render={() => (f === false ? <Redirect to="/" /> : <SignInAndSignUpPage />)}
          />
        </Switch>
      </Container>
    </ApolloProvider>
  );
};

export default App;
