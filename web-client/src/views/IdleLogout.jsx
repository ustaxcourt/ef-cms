import { connect } from '@cerebral/react';
import { state } from 'cerebral';
import React from 'react';

export const IdleLogout = connect(
  { loginUrl: state.cognitoLoginUrl },
  ({ loginUrl }) => {
    return (
      <section className="usa-section usa-grid">
        <h1 tabIndex="-1">Session Timeout</h1>
        <hr />
        <h2>You weren&apos;t active so we logged you out.</h2>
        <p>
          You can return to your Dashboard by logging in again, or visit the
          United States Tax Court website for information on court services and
          contact information.
        </p>
        <a href={loginUrl} className="usa-button align-right">
          Log In
        </a>
        &nbsp;&nbsp;
        <a
          href="https://www.ustaxcourt.gov/"
          className="usa-button usa-button-secondary align-right"
        >
          Go to the U.S. Tax Court Website
        </a>
      </section>
    );
  },
);
