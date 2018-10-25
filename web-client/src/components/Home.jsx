import React from 'react';
import { state, sequences } from 'cerebral';
import { connect } from '@cerebral/react';

export default connect(
  {
    response: state.response,
  },
  function Home() {
    return (
      <section className="usa-section usa-grid">
        <p>
          <a href="/log-in">Log in</a>
        </p>
        <p>
          <a href="/file-a-petition">File a petition</a>
        </p>
        <p>
          <a href="/style-guide">Style guide</a>
        </p>
      </section>
    );
  },
);
