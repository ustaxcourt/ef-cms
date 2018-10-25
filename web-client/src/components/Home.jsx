import React from 'react';
import { connect } from '@cerebral/react';

export default connect(
  {},
  function Home() {
    return (
      <section className="usa-section usa-grid">
        <p>
          <a className="usa-button" href="/file-a-petition">
            Start a case
          </a>
        </p>
        <p>
          <a href="/log-in">Log in</a>
        </p>
        <p>
          <a href="/style-guide">Style guide</a>
        </p>
      </section>
    );
  },
);
