import { connect } from '@cerebral/react';
import { sequences } from 'cerebral';
import React from 'react';

export const IdleLogout = connect(
  { redirectToLoginSequence: sequences.redirectToLoginSequence },
  ({ redirectToLoginSequence }) => {
    return (
      <section className="usa-section grid-container">
        <h1 tabIndex="-1">Session Timeout</h1>
        <hr />
        <h2>You weren’t active so we logged you out.</h2>
        <p>
          You can return to your Dashboard by logging in again, or visit the
          United States Tax Court website for information on court services and
          contact information.
        </p>
        <button
          className="usa-button align-right"
          onClick={() => redirectToLoginSequence()}
        >
          Log In
        </button>{' '}
        <a
          className="usa-button usa-button--outline align-right"
          href="https://www.ustaxcourt.gov/"
        >
          Go to the U.S. Tax Court Website
        </a>
      </section>
    );
  },
);
