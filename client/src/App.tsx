import React from 'react';
import Container from '@material-ui/core/Container';
import SignInAndSignUpPage from './pages/SignInAndSignUpPage';
import { Redirect, Route, Switch } from 'react-router-dom';

function App() {
  return (
    <Container>
      <Switch>
        <Route exact path="/" component={HomePage} />
        <Route
          exact
          path="/signin"
          render={() => (currentUser ? (
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
