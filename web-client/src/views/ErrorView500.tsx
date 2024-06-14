import { BigHeader } from './BigHeader';
import { Button } from '../ustc-ui/Button/Button';
import { connect } from '@web-client/presenter/shared.cerebral';
import { state } from '@web-client/presenter/app.cerebral';
import React from 'react';

export const ErrorView500 = connect(
  {
    alertHelper: state.alertHelper,
  },
  function ErrorView500({ alertHelper }) {
    return (
      <>
        <BigHeader text="Error 500" />
        <section className="usa-section grid-container">
          <h2>Something went wrong in our system.</h2>
          <p className="margin-bottom-5">
            You can return to your Dashboard and try again, or visit the United
            States Tax Court website for information on court services and
            contact information.
          </p>
          {alertHelper.showLogIn && (
            <Button data-testid="back-to-dashboard" href="/" id="home">
              Back to Dashboard
            </Button>
          )}
          {!alertHelper.showLogIn && (
            <Button href="/" id="home">
              Home
            </Button>
          )}
          <Button link href="https://www.ustaxcourt.gov/" id="us-tax-court">
            Go to the U.S. Tax Court Website
          </Button>
        </section>
      </>
    );
  },
);

ErrorView500.displayName = 'ErrorView500';
