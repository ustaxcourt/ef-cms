import { connect } from '@cerebral/react';
import { state } from 'cerebral';

import React from 'react';

export default connect(
  {
    alertHelper: state.alertHelper,
  },
  function Error({ alertHelper }) {
    return (
      <section className="usa-section usa-grid">
        <h1 tabIndex="-1">We can’t find the page you requested</h1>
        <hr />
        <h2>Where do you go from here?</h2>
        <p>
          You can return to your Dashboard and try again, or visit the United
          States Tax Court website for information on court services and contact
          information.
        </p>
        <div>
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
            className="usa-button usa-button-secondary"
            href="https://www.ustaxcourt.gov/"
            id="us-tax-court"
          >
            Go to the U.S. Tax Court Website
          </a>
        </div>
      </section>
    );
  },
);
