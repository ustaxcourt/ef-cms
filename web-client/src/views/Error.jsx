import { BigHeader } from './BigHeader';
import { connect } from '@cerebral/react';
import { state } from 'cerebral';
import React from 'react';

export const Error = connect(
  {
    alertHelper: state.alertHelper,
  },
  ({ alertHelper }) => {
    return (
      <React.Fragment>
        <BigHeader text="Error 404" />
        <section className="usa-section grid-container">
          <h2>We can’t find the page you requested.</h2>
          <p>
            You can return to your Dashboard and try again, or visit the United
            States Tax Court website for information on court services and
            contact information.
          </p>
          <div className="button-box-container">
            {alertHelper.showLogIn && (
              <a className="usa-button" href="/" id="home">
                Back to Dashboard
              </a>
            )}
            {!alertHelper.showLogIn && (
              <a className="usa-button" href="/" id="home">
                Home
              </a>
            )}

            <a
              className="usa-button usa-button--outline"
              href="https://www.ustaxcourt.gov/"
              id="us-tax-court"
            >
              Go to the U.S. Tax Court Website
            </a>
          </div>
        </section>
      </React.Fragment>
    );
  },
);
