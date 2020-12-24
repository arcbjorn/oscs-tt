import React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import { ApolloProvider } from '@apollo/client';
import './i18n/config';

import Container from '@material-ui/core/Container';
import client from './apollo';

import SignInAndSignUpPage from './pages/SignInAndSignUpPage';
import LandingPage from './pages/LandingPage';

const App: React.FC = () => {
  return (
    <ApolloProvider client={client}>
      <Container>
        <Switch>
          <Route exact path="/" component={LandingPage} />
          <Route
            exact
            path="/signin"
            render={() => (false ? <Redirect to="/" /> : <SignInAndSignUpPage />)}
          />
        </Switch>
      </Container>
    </ApolloProvider>
  );
};

export default App;
