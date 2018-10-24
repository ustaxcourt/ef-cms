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
          <a href="/file-a-petition">File a Petition</a>
        </p>
        <p>
          <a href="/style-guide">Style Guide</a>
        </p>
      </section>
    );
  },
);
