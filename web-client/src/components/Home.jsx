import React from 'react';
import { state, sequences } from 'cerebral';
import { connect } from '@cerebral/react';

export default connect(
  {
    response: state.response,
    getHello: sequences.getHello,
  },
  function Home({ response, getHello }) {
    return (
      <section className="usa-section usa-grid">
        <h2>Hello World!</h2>
        <p>
          <button id="hello-button" onClick={() => getHello()}>
            Hello?
          </button>
        </p>
        <p id="response">{response}</p>
        <p>
          <a href="/file-a-petition">File a Petition</a>
        </p>
        <p>
          <a href="/style-guide">Style Guide</a>
        </p>
      </section>
    );
  },
);
