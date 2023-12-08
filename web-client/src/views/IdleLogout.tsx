import { Button } from '../ustc-ui/Button/Button';
import { connect } from '@web-client/presenter/shared.cerebral';
import { sequences } from '@web-client/presenter/app.cerebral';
import React from 'react';

export const IdleLogout = connect(
  { navigateToLoginSequence: sequences.navigateToLoginSequence },
  function IdleLogout({ navigateToLoginSequence }) {
    return (
      <section className="usa-section grid-container">
        <h1 tabIndex={-1}>Session Timeout</h1>
        <hr />
        <h2>You weren’t active so we logged you out.</h2>
        <p>
          You can return to your Dashboard by logging in again, or visit the
          United States Tax Court website for information on court services and
          contact information.
        </p>
        <Button onClick={() => navigateToLoginSequence()}>Log In</Button>
        <Button link href="https://www.ustaxcourt.gov/">
          Go to the U.S. Tax Court Website
        </Button>
      </section>
    );
  },
);

IdleLogout.displayName = 'IdleLogout';
