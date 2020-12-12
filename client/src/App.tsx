import React from 'react';
import Container from '@material-ui/core/Container';
import SignIn from './pages/SignIn';
import { Box } from '@material-ui/core';

function App() {
  return (
    <Container>
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
      >
        <SignIn />
      </Box>
    </Container>
  );
}

export default App;
