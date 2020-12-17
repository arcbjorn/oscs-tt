import React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';

import Container from '@material-ui/core/Container';

import SignInAndSignUpPage from './pages/SignInAndSignUpPage';
import LandingPage from './pages/LandingPage';

function App() {
  return (
    <Container>
      <Switch>
        <Route exact path="/" component={LandingPage} />
        <Route
          exact
          path="/signin"
          render={() => (false ? (
            <Redirect to="/" />
          ) : (
            <SignInAndSignUpPage />
          ))}
        />
      </Switch>
    </Container>
  );
}

export default App;
