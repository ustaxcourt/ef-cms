import { connect } from '@cerebral/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { state } from 'cerebral';
import React from 'react';

export const Interstitial = connect(
  {
    alertHelper: state.alertHelper,
  },
  ({ alertHelper }) => {
    return (
      <>
        {alertHelper.showErrorAlert && (
          <section className="usa-section usa-grid">
            <h1 tabIndex="-1">We’re experiencing technical problems</h1>
            <h2>Where do you go from here?</h2>
            <p>
              You can return to the previous screen and try again, or visit the
              United States Tax Court website for information on court services
              and contact information.
            </p>
            <button
              className="usa-button"
              type="button"
              onClick={() => history.back()}
            >
              Back
            </button>
          </section>
        )}
        {!alertHelper.showErrorAlert && (
          <>
            <div
              aria-label="please wait"
              aria-live="assertive"
              className="progress-indicator"
            >
              <FontAwesomeIcon
                icon="sync"
                className="fa-spin spinner"
                size="6x"
              />
            </div>
          </>
        )}
      </>
    );
  },
);
