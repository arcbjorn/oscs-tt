import React from 'react';
import Container from '@material-ui/core/Container';
import Box from '@material-ui/core/Box';

function App() {
  return (
    <Container maxWidth="sm">
      <Box my={4}>
        <img className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <p>HELLO NASTYA</p>
        <a
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </Box>
    </Container>
  );
}

export default App;
