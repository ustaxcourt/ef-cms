import React from 'react';
import { state, sequences } from 'cerebral';
import { connect } from '@cerebral/react';

import UsaBanner from './UsaBanner';

/**
 * Root application component
 */
export default connect(
  {
    response: state.response,
    getHello: sequences.getHello,
    getTrivia: sequences.getTrivia,
  },
  function AppComponent({ response, getHello, getTrivia }) {
    return (
      <React.Fragment>
        <UsaBanner />
        <h3>App Component</h3>
        <p>Click a button!</p>
        <p>
          <button id="hello-button" onClick={() => getHello()}>
            Hello
          </button>
          <button id="trivia-button" onClick={() => getTrivia()}>
            Trivia
          </button>
        </p>
        <p id="response">{response}</p>
      </React.Fragment>
    );
  },
);
