import { Button } from '../ustc-ui/Button/Button';
import { connect } from '@web-client/presenter/shared.cerebral';
import { sequences } from '@web-client/presenter/app.cerebral';
import React from 'react';

export const OldLogin = connect(
  { navigateToLoginSequence: sequences.navigateToLoginSequence },
  function OldLogin({ navigateToLoginSequence }) {
    return (
      <section className="usa-section grid-container">
        <h1 tabIndex={-1}>Updated DAWSON Login URL</h1>
        <hr />
        <h2>It looks like you are trying to use our old login page.</h2>
        <p>
          As of Sunday, March 17th, 2024, DAWSON has a new login page. Please
          update your bookmarks. The new login URL is:
        </p>
        <p>
          <a href="https://dawson.ustaxcourt.gov/login">
            https://dawson.ustaxcourt.gov/login
          </a>
        </p>
        <p>
          Here is an{' '}
          <a
            href="https://ustaxcourt.gov/dawson_faqs_login.html"
            rel="noreferrer"
            target="_blank"
          >
            FAQ page on our website
          </a>{' '}
          about this update.
        </p>
        <Button onClick={() => navigateToLoginSequence()}>Log In</Button>
        <Button link href="https://www.ustaxcourt.gov/">
          Go to the U.S. Tax Court Website
        </Button>
      </section>
    );
  },
);

OldLogin.displayName = 'OldLogin';
